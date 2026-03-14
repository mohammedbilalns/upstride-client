import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { env } from "@/shared/config/env";
import { useSocialLogin } from "../hooks/use-social-login";
import type { AuthView } from "../types";

interface Props {
	onNavigate?: (view: AuthView, payload?: string) => void;
}

const LINKEDIN_OAUTH_STATE_KEY = "linkedin_oauth_state";
const LINKEDIN_MESSAGE_SOURCE = "linkedin-oauth";

export function SocialAuthButtons({ onNavigate }: Props) {
	const router = useRouter();
	const [activeProvider, setActiveProvider] = useState<
		"GOOGLE" | "LINKEDIN" | null
	>(null);
	const linkedInRedirectUri =
		env.LINKEDIN_REDIRECT_URI || `${window.location.origin}/linkedin`;
	const linkedInPopupRef = useRef<Window | null>(null);
	const linkedInPopupPollRef = useRef<number | null>(null);

	const socialLogin = useSocialLogin({
		onSuccess: async (result) => {
			setActiveProvider(null);
			if (result.type === "onboarding") {
				onNavigate?.("onboarding", result.setupToken);
				return;
			}

			if (result.user.role === "ADMIN" || result.user.role === "SUPER_ADMIN") {
				await router.navigate({ to: "/dashboard" });
				return;
			}

			await router.navigate({ to: "/home" });
		},
		onError: (error) => {
			setActiveProvider(null);
			const errorData = error as { response?: { data?: { message?: string } } };
			toast.error(
				errorData.response?.data?.message ||
					"Social login failed. Please try again.",
			);
		},
	});

	const clearLinkedInPopupState = () => {
		if (linkedInPopupPollRef.current) {
			window.clearInterval(linkedInPopupPollRef.current);
			linkedInPopupPollRef.current = null;
		}

		if (linkedInPopupRef.current && !linkedInPopupRef.current.closed) {
			linkedInPopupRef.current.close();
		}

		linkedInPopupRef.current = null;
	};

	useEffect(() => {
		const handleLinkedInMessage = (event: MessageEvent) => {
			if (event.origin !== window.location.origin) return;

			const data = event.data as {
				from?: string;
				code?: string;
				error?: string;
				errorMessage?: string;
				state?: string;
			};

			if (data.from !== LINKEDIN_MESSAGE_SOURCE) return;

			const expectedState = window.sessionStorage.getItem(
				LINKEDIN_OAUTH_STATE_KEY,
			);

			if (!data.state || data.state !== expectedState) {
				clearLinkedInPopupState();
				setActiveProvider(null);
				toast.error("LinkedIn login failed. Invalid OAuth state.");
				return;
			}

			window.sessionStorage.removeItem(LINKEDIN_OAUTH_STATE_KEY);
			clearLinkedInPopupState();

			if (data.error) {
				setActiveProvider(null);
				toast.error(data.errorMessage || "LinkedIn login failed.");
				return;
			}

			if (!data.code) {
				setActiveProvider(null);
				toast.error("LinkedIn login failed.");
				return;
			}

			socialLogin.mutate({
				provider: "LINKEDIN",
				code: data.code,
				redirectUri: linkedInRedirectUri,
			});
		};

		window.addEventListener("message", handleLinkedInMessage);

		return () => {
			window.removeEventListener("message", handleLinkedInMessage);
			if (linkedInPopupPollRef.current || linkedInPopupRef.current) {
				clearLinkedInPopupState();
			}
		};
	}, [linkedInRedirectUri, socialLogin.mutate]);

	const googleLogin = useGoogleLogin({
		flow: "auth-code",
		onSuccess: (codeResponse) => {
			socialLogin.mutate({
				provider: "GOOGLE",
				code: codeResponse.code,
			});
		},
		onError: () => {
			setActiveProvider(null);
			toast.error("Google login failed.");
		},
		onNonOAuthError: () => {
			setActiveProvider(null);
		},
	});

	const handleGoogle = () => {
		setActiveProvider("GOOGLE");
		googleLogin();
	};

	const handleLinkedIn = () => {
		if (!env.LINKEDIN_CLIENT_ID) {
			toast.error("LinkedIn client ID is not configured.");
			return;
		}

		setActiveProvider("LINKEDIN");

		const state = crypto.randomUUID();
		window.sessionStorage.setItem(LINKEDIN_OAUTH_STATE_KEY, state);

		const authUrl = new URL("https://www.linkedin.com/oauth/v2/authorization");
		authUrl.searchParams.set("response_type", "code");
		authUrl.searchParams.set("client_id", env.LINKEDIN_CLIENT_ID);
		authUrl.searchParams.set("redirect_uri", linkedInRedirectUri);
		authUrl.searchParams.set("scope", "openid profile email");
		authUrl.searchParams.set("state", state);

		const popup = window.open(
			authUrl.toString(),
			"linkedin-oauth",
			"width=600,height=700,left=200,top=100",
		);

		if (!popup) {
			window.sessionStorage.removeItem(LINKEDIN_OAUTH_STATE_KEY);
			setActiveProvider(null);
			toast.error("Unable to open LinkedIn login. Allow popups and try again.");
			return;
		}

		linkedInPopupRef.current = popup;

		if (linkedInPopupPollRef.current) {
			window.clearInterval(linkedInPopupPollRef.current);
		}

		linkedInPopupPollRef.current = window.setInterval(() => {
			if (linkedInPopupRef.current?.closed) {
				window.clearInterval(linkedInPopupPollRef.current ?? undefined);
				linkedInPopupPollRef.current = null;
				linkedInPopupRef.current = null;
				window.sessionStorage.removeItem(LINKEDIN_OAUTH_STATE_KEY);
				setActiveProvider(null);
			}
		}, 500);
	};

	return (
		<div className="grid grid-cols-2 gap-3">
			<Button
				type="button"
				variant="outline"
				className="flex items-center gap-2 font-medium border-border hover:bg-muted/60 transition-colors"
				onClick={handleGoogle}
				disabled={activeProvider !== null}
			>
				{activeProvider === "GOOGLE" ? (
					<Loader2 className="h-4 w-4 animate-spin" />
				) : (
					<svg
						className="h-4 w-4 shrink-0"
						viewBox="0 0 24 24"
						aria-labelledby="googleIconTitle"
					>
						<title id="googleIconTitle">Google Logo</title>
						<path
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							fill="#4285F4"
						/>
						<path
							d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							fill="#34A853"
						/>
						<path
							d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
							fill="#FBBC05"
						/>
						<path
							d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
							fill="#EA4335"
						/>
					</svg>
				)}
				Google
			</Button>

			<Button
				type="button"
				variant="outline"
				className="flex items-center gap-2 font-medium border-border hover:bg-muted/60 transition-colors"
				onClick={handleLinkedIn}
				disabled={activeProvider !== null}
			>
				{activeProvider === "LINKEDIN" ? (
					<Loader2 className="h-4 w-4 animate-spin" />
				) : (
					<svg
						className="h-4 w-4 flex-shrink-0 text-[#0A66C2]"
						viewBox="0 0 24 24"
						fill="currentColor"
						aria-labelledby="linkedInIconTitle"
					>
						<title id="linkedInIconTitle">LinkedIn Logo</title>
						<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
					</svg>
				)}
				LinkedIn
			</Button>
		</div>
	);
}

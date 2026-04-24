import { GoogleOAuthProvider } from "@react-oauth/google";
import { Zap } from "lucide-react";
import { useState } from "react";
import { OnboardingView } from "@/features/onboarding/components/OnboardingView";
import { env } from "@/shared/config/env";
import { AuthQuoteCarousel } from "../components/AuthQuoteCarousel";
import { ChangePasswordView } from "../components/ChangePasswordView";
import { ForgotPasswordOtpView } from "../components/ForgotPasswordOtpView";
import { ForgotPasswordView } from "../components/ForgotPasswordView";
import { LoginView } from "../components/LoginView";
import { OtpView } from "../components/OtpView";
import { RegisterView } from "../components/RegisterView";
import type { AuthView } from "../types";

export default function AuthPage() {
	const [view, setView] = useState<AuthView>("login");
	const [pendingEmail, setPendingEmail] = useState("");
	const [resetToken, setResetToken] = useState("");
	const [setupToken, setSetupToken] = useState("");

	function handleNavigate(nextView: AuthView, payload?: string) {
		if (nextView === "register-otp" || nextView === "forgot-password-otp") {
			if (payload) setPendingEmail(payload);
		}
		if (nextView === "change-password") {
			if (payload) setResetToken(payload);
		}
		if (nextView === "onboarding") {
			if (payload) setSetupToken(payload);
		}
		setView(nextView);
	}

	const titles: Record<AuthView, string> = {
		login: "Sign in to your account",
		register: "Create an account",
		"register-otp": "Verify your email",
		"forgot-password": "Reset your password",
		"forgot-password-otp": "Enter reset code",
		"change-password": "Set new password",
		onboarding: "Customize your experience",
	};

	return (
		<GoogleOAuthProvider clientId={env.GOOGLE_CLIENT_ID}>
			<div className="min-h-screen bg-background flex">
				{/* Left Slider */}
				<AuthQuoteCarousel />

				{/* Right form  */}
				<div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
					{/* Mobile logo */}
					<div className="md:hidden flex items-center gap-2.5 mb-8">
						<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
							<Zap className="h-4 w-4 text-primary-foreground" />
						</div>
						<span className="text-xl font-bold tracking-tight">UpStride</span>
					</div>

					<noscript>
						<title>{titles[view]}</title>
					</noscript>

					<div
						className={`w-full ${view === "onboarding" ? "max-w-2xl" : "max-w-sm"}`}
					>
						{view === "login" && <LoginView onNavigate={handleNavigate} />}

						{view === "register" && (
							<RegisterView onNavigate={handleNavigate} />
						)}

						{view === "register-otp" && (
							<OtpView email={pendingEmail} onNavigate={handleNavigate} />
						)}

						{view === "forgot-password" && (
							<ForgotPasswordView onNavigate={handleNavigate} />
						)}

						{view === "forgot-password-otp" && (
							<ForgotPasswordOtpView
								email={pendingEmail}
								onNavigate={handleNavigate}
							/>
						)}

						{view === "change-password" && (
							<ChangePasswordView
								email={pendingEmail}
								resetToken={resetToken}
								onNavigate={handleNavigate}
							/>
						)}

						{view === "onboarding" && (
							<OnboardingView setupToken={setupToken} />
						)}
					</div>
				</div>
			</div>
		</GoogleOAuthProvider>
	);
}

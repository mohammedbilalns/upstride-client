import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import type { UserRole } from "@/shared/types/user";
import { authService } from "../services/auth.service";
import type { SocialLoginInput, SocialLoginResponse } from "../types";
import { setAuthSession } from "../utils/set-auth-session";

export function useSocialLogin(options?: {
	onSuccess?: (
		data:
			| { type: "login"; user: { role: UserRole } }
			| { type: "onboarding"; setupToken: string },
	) => void;
	onError?: (
		error: Error | { response?: { data?: { message?: string } } },
	) => void;
}) {
	const router = useRouter();

	return useMutation({
		mutationFn: (data: SocialLoginInput) => authService.socialLogin(data),
		onSuccess: (response) => {
			const payload = response.data as SocialLoginResponse;
			if ("setupToken" in payload) {
				options?.onSuccess?.({
					type: "onboarding",
					setupToken: payload.setupToken,
				});
				return;
			}

			const user = payload.user;
			const accessToken = payload.accessToken;
			if (user && accessToken) {
				setAuthSession(router, user, accessToken);
			}
			options?.onSuccess?.({ type: "login", user });
		},
		onError: options?.onError,
	});
}

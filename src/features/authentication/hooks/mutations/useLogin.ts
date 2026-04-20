import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import type { ApiError } from "@/api/apiError";
import type { UserRole } from "@/shared/types/user";
import { authService } from "../../services/auth.service";
import { setAuthSession } from "../../utils/setAuthSession";
import type { LoginFormValues } from "../../validators/login.schema";

/**
 * handles user login functionality.
 */
export function useLogin(options?: {
	onSuccess?: (data: { user: { role: UserRole } }) => void;
	onError?: (error: ApiError) => void;
}) {
	const router = useRouter();

	return useMutation({
		mutationFn: (data: LoginFormValues) => authService.login(data),
		onSuccess: (response) => {
			const payload = response.data;
			const { user, accessToken, csrfToken } = payload;
			// set Auth session
			if (user && accessToken && csrfToken) {
				setAuthSession(router, user, accessToken, csrfToken);
			}
			if (user) {
				options?.onSuccess?.({ user });
			}
		},
		onError: options?.onError,
	});
}

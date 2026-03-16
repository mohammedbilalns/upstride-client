import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import type { UserRole } from "@/shared/types/user";
import { authService } from "../services/auth.service";
import { setAuthSession } from "../utils/set-auth-session";
import type { LoginPayload } from "../validators/login.schema";
import type { ApiError } from "@/api/apiError";

/**
 * handles user login functionality.
 */
export function useLogin(options?: {
	onSuccess?: (data: { user: { role: UserRole } }) => void;
	onError?: (error: ApiError) => void;
}) {
	const router = useRouter();

	return useMutation({
		mutationFn: (data: LoginPayload) => authService.login(data),
		onSuccess: (response) => {
			const user = response.data?.user;
			const accessToken = response.data?.accessToken;
			// set Auth session
			if (user && accessToken) {
				setAuthSession(router, user, accessToken);
			}
			options?.onSuccess?.({ user: response.data?.user });
		},
		onError: options?.onError,
	});
}

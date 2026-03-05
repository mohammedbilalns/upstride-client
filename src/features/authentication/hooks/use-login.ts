import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import type { UserRole } from "@/shared/types/user";
import { authService } from "../services/auth.service";
import type { LoginPayload } from "../validators/login.schema";

export function useLogin(options?: {
	onSuccess?: (data: { user: { role: UserRole } }) => void;
	onError?: (
		error: Error | { response?: { data?: { message?: string } } },
	) => void;
}) {
	const router = useRouter();

	return useMutation({
		mutationFn: (data: LoginPayload) => authService.login(data),
		onSuccess: (response) => {
			// Update router auth context
			const user = response.data?.user;
			const accessToken = response.data?.accessToken;

			if (user && accessToken && router.options.context) {
				router.options.context.auth = {
					isAuthenticated: true,
					user: user as typeof router.options.context.auth.user,
					accessToken,
				};
			}

			options?.onSuccess?.({ user: response.data?.user });
		},
		onError: options?.onError,
	});
}

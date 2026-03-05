import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import type { LoginPayload } from "../validators/login.schema";
import { useRouter } from "@tanstack/react-router";
import type { UserRole } from "@/shared/types/user";

export function useLogin(options?: {
	onSuccess?: (data: { user: { role: UserRole } }) => void;
	onError?: (error: any) => void;
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
					user,
					accessToken,
				};
			}

			options?.onSuccess?.({ user: response.data?.user });
		},
		onError: options?.onError,
	});
}

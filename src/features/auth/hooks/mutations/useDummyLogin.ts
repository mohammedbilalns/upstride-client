import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import type { ApiError } from "@/api/apiError";
import type { UserRole } from "@/shared/types/user";
import { authService } from "../../services/auth.service";
import { setAuthSession } from "../../utils/setAuthSession";

export function useDummyLogin(options?: {
	onSuccess?: (data: { user: { role: UserRole } }) => void;
	onError?: (error: ApiError) => void;
}) {
	const router = useRouter();

	return useMutation({
		mutationFn: () => authService.dummyLogin(),
		onSuccess: (response) => {
			const payload = response.data;
			const { user, accessToken, csrfToken } = payload;

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

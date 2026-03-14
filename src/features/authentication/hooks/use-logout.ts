import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import type { ApiError } from "@/api/apiError";
import { authService } from "../services/auth.service";
import { clearAuthSession } from "../utils/clear-auth-session";

/**
 *  handles user logout functionality.
 */
export function useLogout() {
	const router = useRouter();

	return useMutation({
		mutationFn: () => authService.logout(),
		onSuccess: () => {
			clearAuthSession(router);
			toast.success("Logged out successfully");
			// Invalidate cached data and navigate to auth page
			router.invalidate();
			router.navigate({ to: "/auth" });
		},
		// Handles logout errors
		onError: (error: ApiError) => {
			if (error.response?.status === 401) {
				clearAuthSession(router);
				router.invalidate();
				router.navigate({ to: "/auth" });
				return;
			}
			toast.error(error.response?.data?.message || "Failed to logout");
		},
	});
}

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/api/apiError";
import { authService } from "../../services/auth.service";
import type { ChangePasswordInput } from "../../types";

interface UseResetPasswordOptions {
	onSuccess?: () => void;
	onError?: (error: ApiError) => void;
}

export const useResetPassword = ({
	onSuccess,
	onError,
}: UseResetPasswordOptions = {}) => {
	return useMutation({
		mutationFn: (data: ChangePasswordInput) => authService.changePassword(data),
		onSuccess: (response) => {
			toast.success(response.message || "Password reset successfully!");
			onSuccess?.();
		},
		onError: (error: ApiError) => {
			console.error("Reset password error:", error);
			onError?.(error);
		},
	});
};

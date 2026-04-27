import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/api/apiError";
import { authService } from "../../services/auth.service";
import type { RequestPasswordResetInput } from "../../types";

interface UseRequestPasswordResetOptions {
	onSuccess?: () => void;
	onError?: (error: ApiError) => void;
}

export const useRequestPasswordReset = ({
	onSuccess,
	onError,
}: UseRequestPasswordResetOptions = {}) => {
	return useMutation({
		mutationFn: (data: RequestPasswordResetInput) =>
			authService.requestPasswordReset(data),
		onSuccess: (response) => {
			toast.success(response.message || "Reset code sent to your email!");
			onSuccess?.();
		},
		onError: (error: ApiError) => {
			console.error("Request password reset error:", error);
			onError?.(error);
		},
	});
};

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authService } from "../services/auth.service";

interface UseResendPasswordResetOtpOptions {
	onSuccess?: () => void;
	onError?: (
		error: Error | { response?: { data?: { message?: string } } },
	) => void;
}

export const useResendPasswordResetOtp = ({
	onSuccess,
	onError,
}: UseResendPasswordResetOtpOptions = {}) => {
	return useMutation({
		mutationFn: (email: string) => authService.resendResetPasswordOtp(email),
		onSuccess: (response) => {
			toast.success(response.message || "Reset code resent successfully!");
			onSuccess?.();
		},
		onError: (error) => {
			console.error("Resend password reset OTP error:", error);
			onError?.(error);
		},
	});
};

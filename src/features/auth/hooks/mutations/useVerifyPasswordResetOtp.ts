import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/api/apiError";
import { authService } from "../../services/auth.service";
import type { VerifyResetOtpResponse } from "../../types";

interface UseVerifyPasswordResetOtpOptions {
	onSuccess?: (data: VerifyResetOtpResponse) => void;
	onError?: (error: ApiError) => void;
}

export const useVerifyPasswordResetOtp = ({
	onSuccess,
	onError,
}: UseVerifyPasswordResetOtpOptions = {}) => {
	return useMutation({
		mutationFn: ({ email, otp }: { email: string; otp: string }) =>
			authService.verifyResetPasswordOtp(email, otp),
		onSuccess: (response) => {
			toast.success(response.message || "OTP verified successfully!");
			onSuccess?.(response.data);
		},
		onError: (error: ApiError) => {
			console.error("Verify password reset OTP error:", error);
			onError?.(error);
		},
	});
};

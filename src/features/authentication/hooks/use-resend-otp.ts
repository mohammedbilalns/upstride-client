import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import type { ApiError } from "@/api/apiError";

interface UseResendOtpOptions {
	onSuccess?: () => void;
	onError?: (error: ApiError) => void;
}

export const useResendOtp = ({
	onSuccess,
	onError,
}: UseResendOtpOptions = {}) => {
	return useMutation({
		mutationFn: (email: string) => authService.resendRegisterOtp(email),
		onSuccess: () => {
			onSuccess?.();
		},
		onError: (error: ApiError) => {
			console.error("Resend OTP error:", error);
			onError?.(error);
		},
	});
};

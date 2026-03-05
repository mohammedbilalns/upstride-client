import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";

interface UseResendOtpOptions {
	onSuccess?: () => void;
	onError?: (
		error: Error | { response?: { data?: { message?: string } } },
	) => void;
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
		onError: (error) => {
			console.error("Resend OTP error:", error);
			onError?.(error);
		},
	});
};

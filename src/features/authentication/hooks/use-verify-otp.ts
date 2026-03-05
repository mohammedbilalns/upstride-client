import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";

interface UseVerifyOtpOptions {
	onSuccess: () => void;
	onError?: (error: any) => void;
}

export const useVerifyOtp = ({ onSuccess, onError }: UseVerifyOtpOptions) => {
	return useMutation({
		mutationFn: ({ email, otp }: { email: string; otp: string }) =>
			authService.verifyRegisterOtp(email, otp),
		onSuccess: () => {
			onSuccess();
		},
		onError: (error) => {
			console.error("OTP verification error:", error);
			onError?.(error);
		},
	});
};

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authService } from "../services/auth.service";
import type { VerifyRegisterOtpResponse } from "../types";

interface UseVerifyOtpOptions {
	onSuccess: (data: VerifyRegisterOtpResponse) => void;
	onError?: (
		error: Error | { response?: { data?: { message?: string } } },
	) => void;
}

export const useVerifyOtp = ({ onSuccess, onError }: UseVerifyOtpOptions) => {
	return useMutation({
		mutationFn: ({ email, otp }: { email: string; otp: string }) =>
			authService.verifyRegisterOtp(email, otp),
		onSuccess: (response) => {
			toast.success(response.message || "Email verified successfully!");
			onSuccess(response.data);
		},
		onError: (error) => {
			console.error("OTP verification error:", error);
			onError?.(error);
		},
	});
};

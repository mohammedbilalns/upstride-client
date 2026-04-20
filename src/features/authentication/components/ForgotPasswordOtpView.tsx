import { useCallback } from "react";
import { toast } from "sonner";
import type { ApiError } from "@/api/apiError";
import { useOtpFlow } from "../hooks/useOtpFlow";
import { useResendPasswordResetOtp } from "../hooks/mutations/useResendPasswordResetOtp";
import { useVerifyPasswordResetOtp } from "../hooks/mutations/useVerifyPasswordResetOtp";
import type { AuthView } from "../types";
import { OtpVerificationPanel } from "./OtpVerificationPanel";

const OTP_TIMEOUT_SECONDS = 120;
const OTP_LENGTH = 6;

interface Props {
	email: string;
	onNavigate: (view: AuthView, resetToken?: string) => void;
}

export function ForgotPasswordOtpView({ email, onNavigate }: Props) {
	const {
		otp,
		handleOtpChange,
		error,
		setError,
		setOtp,
		resendTimer,
		canResend,
		resetTimers,
	} = useOtpFlow({
		resendCooldownSeconds: OTP_TIMEOUT_SECONDS,
	});

	const verifyMutation = useVerifyPasswordResetOtp({
		onSuccess: (data) => {
			onNavigate("change-password", data.resetToken);
		},
	});

	const resendMutation = useResendPasswordResetOtp();

	const getErrorMessage = useCallback((err: ApiError, fallback: string) => {
		return err.response?.data?.message || fallback;
	}, []);

	const shouldRedirectToLogin = useCallback((message: string) => {
		const normalized = message.toLowerCase();
		return (
			(normalized.includes("attempt") &&
				(normalized.includes("maximum") ||
					normalized.includes("exceeded") ||
					normalized.includes("too many") ||
					normalized.includes("max"))) ||
			normalized.includes("maximum attempts")
		);
	}, []);

	const handleVerify = useCallback(async () => {
		if (otp.length < OTP_LENGTH) return;
		setError(null);
		try {
			await verifyMutation.mutateAsync({ email, otp });
		} catch (err) {
			const message = getErrorMessage(
				err as ApiError,
				"Invalid or expired OTP. Please try again.",
			);
			if (shouldRedirectToLogin(message)) {
				toast.error(message);
				onNavigate("login");
				return;
			}
			setError(message);
		}
	}, [
		email,
		getErrorMessage,
		onNavigate,
		otp,
		setError,
		shouldRedirectToLogin,
		verifyMutation,
	]);

	const handleResend = useCallback(async () => {
		if (!canResend) return;
		setError(null);
		try {
			await resendMutation.mutateAsync(email);
			setOtp("");
			resetTimers();
		} catch (err) {
			const message = getErrorMessage(err as ApiError, "Failed to resend OTP.");
			if (shouldRedirectToLogin(message)) {
				toast.error(message);
				onNavigate("login");
				return;
			}
			setError(message);
		}
	}, [
		canResend,
		email,
		getErrorMessage,
		onNavigate,
		resetTimers,
		resendMutation,
		setError,
		setOtp,
		shouldRedirectToLogin,
	]);

	return (
		<OtpVerificationPanel
			backLabel="Back"
			onBack={() => onNavigate("forgot-password")}
			title="Enter reset code"
			description={
				<>
					We sent a {OTP_LENGTH}-digit reset code to{" "}
					<span className="font-medium text-foreground">{email}</span>
				</>
			}
			otp={otp}
			onOtpChange={handleOtpChange}
			otpLength={OTP_LENGTH}
			error={error}
			verifyPending={verifyMutation.isPending}
			resendPending={resendMutation.isPending}
			onVerify={handleVerify}
			onResend={handleResend}
			canResend={canResend}
			resendTimer={resendTimer}
			verifyButtonText="Verify & Continue"
		/>
	);
}

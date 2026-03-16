import { useCallback } from "react";
import { useOtpFlow } from "../hooks/use-otp-flow";
import { useResendPasswordResetOtp } from "../hooks/use-resend-password-reset-otp";
import { useVerifyPasswordResetOtp } from "../hooks/use-verify-password-reset-otp";
import type { AuthView } from "../types";
import { OtpVerificationPanel } from "./OtpVerificationPanel";
import type { ApiError } from "@/api/apiError";

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

	const handleVerify = useCallback(async () => {
		if (otp.length < OTP_LENGTH) return;
		setError(null);
		try {
			await verifyMutation.mutateAsync({ email, otp });
		} catch (err) {
			const error = err as ApiError;
			setError(
				error.response?.data?.message ||
					"Invalid or expired OTP. Please try again.",
			);
		}
	}, [email, otp, setError, verifyMutation]);

	const handleResend = useCallback(async () => {
		if (!canResend) return;
		setError(null);
		try {
			await resendMutation.mutateAsync(email);
			setOtp("");
			resetTimers();
		} catch (err) {
			const error = err as ApiError;
			setError(error.response?.data?.message || "Failed to resend OTP.");
		}
	}, [canResend, email, resetTimers, resendMutation, setError, setOtp]);

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

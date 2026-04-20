import { useCallback } from "react";
import { toast } from "sonner";
import type { ApiError } from "@/api/apiError";
import { useOtpFlow } from "../hooks/useOtpFlow";
import { useResendOtp } from "../hooks/mutations/useResendOtp";
import { useVerifyOtp } from "../hooks/mutations/useVerifyOtp";
import type { AuthView } from "../types";
import { OtpVerificationPanel } from "./OtpVerificationPanel";

const OTP_RESEND_COOLDOWN = 60;
const OTP_EXPIRY_SECONDS = 300;
const OTP_LENGTH = 6;
const DIGITS_ONLY_PATTERN = "^\\d+$";

interface Props {
	email: string;
	onNavigate: (view: AuthView, payload?: string) => void;
}

export function OtpView({ email, onNavigate }: Props) {
	const {
		otp,
		handleOtpChange,
		error,
		setError,
		setOtp,
		resendTimer,
		canResend,
		expiryTimer,
		isExpired,
		resetTimers,
	} = useOtpFlow({
		resendCooldownSeconds: OTP_RESEND_COOLDOWN,
		expirySeconds: OTP_EXPIRY_SECONDS,
	});

	const verifyMutation = useVerifyOtp({
		onSuccess: (data) => {
			onNavigate("onboarding", data.setupToken);
		},
	});

	const resendMutation = useResendOtp();

	const getErrorMessage = useCallback((err: ApiError, fallback: string) => {
		return err.response?.data?.message || fallback;
	}, []);

	const shouldRedirectToRegister = useCallback(
		(message: string) =>
			message.toLowerCase().includes("maximum") ||
			message.toLowerCase().includes("exceeded"),
		[],
	);

	const handleVerify = useCallback(async () => {
		if (otp.length < OTP_LENGTH || isExpired) return;
		setError(null);

		try {
			await verifyMutation.mutateAsync({ email, otp });
		} catch (err) {
			const message = getErrorMessage(
				err as ApiError,
				"Invalid or expired OTP. Please try again.",
			);
			if (shouldRedirectToRegister(message)) {
				toast.error(message);
				onNavigate("register");
				return;
			}
			setError(message);
		}
	}, [
		email,
		getErrorMessage,
		isExpired,
		onNavigate,
		otp,
		setError,
		shouldRedirectToRegister,
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
			const message = getErrorMessage(
				err as ApiError,
				"Failed to resend OTP. Please try again later.",
			);
			if (shouldRedirectToRegister(message)) {
				toast.error(message);
				onNavigate("register");
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
		shouldRedirectToRegister,
	]);

	return (
		<OtpVerificationPanel
			backLabel="Back to register"
			onBack={() => onNavigate("register")}
			title="Check your email"
			description={
				<>
					We sent a code to{" "}
					<span className="font-medium text-foreground">{email}</span>
				</>
			}
			otp={otp}
			onOtpChange={handleOtpChange}
			otpLength={OTP_LENGTH}
			error={error}
			isExpired={isExpired}
			expiryTimer={expiryTimer}
			showExpiryBadge={true}
			verifyPending={verifyMutation.isPending}
			resendPending={resendMutation.isPending}
			onVerify={handleVerify}
			onResend={handleResend}
			canResend={canResend}
			resendTimer={resendTimer}
			verifyButtonText="Verify Email"
			expiredVerifyButtonText="Code Expired"
			digitsOnlyPattern={DIGITS_ONLY_PATTERN}
		/>
	);
}

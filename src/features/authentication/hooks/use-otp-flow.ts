import { useCallback, useEffect, useRef, useState } from "react";

interface UseOtpFlowOptions {
	resendCooldownSeconds: number;
	expirySeconds?: number;
	expiryErrorMessage?: string;
}

export function formatSecondsToClock(s: number) {
	return `${Math.floor(s / 60)
		.toString()
		.padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
}

/**
 * Manages OTP input state, resend cooldown timer, and expiry timer.
 */
//TODO: check the timer state resets
export function useOtpFlow({
	resendCooldownSeconds,
	expirySeconds,
	expiryErrorMessage = "This verification code has expired. Please request a new one.",
}: UseOtpFlowOptions) {
	const [otp, setOtp] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [resendTimer, setResendTimer] = useState(resendCooldownSeconds);
	const [canResend, setCanResend] = useState(false);
	const [expiryTimer, setExpiryTimer] = useState<number | null>(
		typeof expirySeconds === "number" ? expirySeconds : null,
	);
	const [isExpired, setIsExpired] = useState(false);

	// Store interval IDs to allow cleanup
	const timersRef = useRef<{
		resend: ReturnType<typeof setInterval> | null;
		expiry: ReturnType<typeof setInterval> | null;
	}>({ resend: null, expiry: null });

	const clearTimers = useCallback(() => {
		if (timersRef.current.resend) clearInterval(timersRef.current.resend);
		if (timersRef.current.expiry) clearInterval(timersRef.current.expiry);
	}, []);

	// Restart both timers with initial values
	const resetTimers = useCallback(() => {
		clearTimers();

		setResendTimer(resendCooldownSeconds);
		setCanResend(false);

		// Resend countdown: decrement every second, enable resend when reaches 0
		timersRef.current.resend = setInterval(() => {
			setResendTimer((prev) => {
				if (prev <= 1) {
					if (timersRef.current.resend) {
						clearInterval(timersRef.current.resend);
					}
					setCanResend(true);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		// Expiry countdown: track if OTP has expired
		if (typeof expirySeconds === "number") {
			setExpiryTimer(expirySeconds);
			setIsExpired(false);

			timersRef.current.expiry = setInterval(() => {
				setExpiryTimer((prev) => {
					if (prev === null) return null;
					if (prev <= 1) {
						if (timersRef.current.expiry) {
							clearInterval(timersRef.current.expiry);
						}
						setIsExpired(true);
						setError(expiryErrorMessage);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		} else {
			setExpiryTimer(null);
			setIsExpired(false);
		}
	}, [clearTimers, expiryErrorMessage, expirySeconds, resendCooldownSeconds]);

	// Initialize timers on mount, cleanup on unmount
	useEffect(() => {
		resetTimers();
		return () => clearTimers();
	}, [clearTimers, resetTimers]);

	const handleOtpChange = useCallback((value: string) => {
		setOtp(value);
		setError(null);
	}, []);

	return {
		otp,
		setOtp,
		handleOtpChange,
		error,
		setError,
		resendTimer,
		canResend,
		expiryTimer,
		isExpired,
		resetTimers,
	};
}

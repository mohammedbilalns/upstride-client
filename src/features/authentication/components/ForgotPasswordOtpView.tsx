import { ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { useResendPasswordResetOtp } from "../hooks/use-resend-password-reset-otp";
import { useVerifyPasswordResetOtp } from "../hooks/use-verify-password-reset-otp";
import type { AuthView } from "../types";

const OTP_TIMEOUT_SECONDS = 120;
const OTP_LENGTH = 6;

interface Props {
	email: string;
	onNavigate: (view: AuthView, resetToken?: string) => void;
}

function formatTime(s: number) {
	return `${Math.floor(s / 60)
		.toString()
		.padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
}

export function ForgotPasswordOtpView({ email, onNavigate }: Props) {
	const [otp, setOtp] = useState("");
	const [timeLeft, setTimeLeft] = useState(OTP_TIMEOUT_SECONDS);
	const [canResend, setCanResend] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const verifyMutation = useVerifyPasswordResetOtp({
		onSuccess: (data) => {
			onNavigate("change-password", data.resetToken);
		},
		onError: (err) => {
			const errorData = err as { response?: { data?: { message?: string } } };
			setError(
				errorData.response?.data?.message ||
					"Invalid or expired OTP. Please try again.",
			);
		},
	});

	const resendMutation = useResendPasswordResetOtp({
		onSuccess: () => {
			setOtp("");
			startTimer();
		},
		onError: (err) => {
			const errorData = err as { response?: { data?: { message?: string } } };
			setError(errorData.response?.data?.message || "Failed to resend OTP.");
		},
	});

	const startTimer = useCallback(() => {
		if (timerRef.current) clearInterval(timerRef.current);
		setTimeLeft(OTP_TIMEOUT_SECONDS);
		setCanResend(false);
		timerRef.current = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					clearInterval(timerRef.current ?? undefined);
					setCanResend(true);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	}, []);

	useEffect(() => {
		startTimer();
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [startTimer]);

	async function handleVerify() {
		if (otp.length < OTP_LENGTH) return;
		setError(null);
		verifyMutation.mutate({ email, otp });
	}

	async function handleResend() {
		if (!canResend) return;
		setError(null);
		resendMutation.mutate(email);
	}

	return (
		<div className="space-y-6">
			<button
				type="button"
				onClick={() => onNavigate("forgot-password")}
				className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
			>
				<ArrowLeft className="h-4 w-4" />
				Back
			</button>

			<div>
				<h2 className="text-2xl font-bold tracking-tight">Enter reset code</h2>
				<p className="text-sm text-muted-foreground mt-1">
					We sent a {OTP_LENGTH}-digit reset code to{" "}
					<span className="font-medium text-foreground">{email}</span>
				</p>
			</div>

			<div className="flex flex-col items-center gap-5">
				<InputOTP
					maxLength={OTP_LENGTH}
					value={otp}
					onChange={(val) => {
						setOtp(val);
						setError(null);
					}}
					onComplete={handleVerify}
				>
					<InputOTPGroup>
						{[...Array(OTP_LENGTH)]
							.map(() => crypto.randomUUID())
							.map((id, index) => (
								<InputOTPSlot key={id} index={index} />
							))}
					</InputOTPGroup>
				</InputOTP>

				{error && (
					<p className="text-sm text-destructive text-center">{error}</p>
				)}
			</div>

			<Button
				onClick={handleVerify}
				disabled={otp.length < OTP_LENGTH || verifyMutation.isPending}
				className="w-full"
			>
				{verifyMutation.isPending && (
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
				)}
				Verify & Continue
			</Button>

			{/* Resend row with inline countdown timer */}
			<div className="flex items-center justify-center gap-2 text-sm">
				<span className="text-muted-foreground">Didn't receive a code?</span>
				<button
					type="button"
					disabled={!canResend || resendMutation.isPending}
					onClick={handleResend}
					className="flex items-center gap-1.5 font-semibold text-primary hover:underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed transition-colors"
				>
					{resendMutation.isPending ? (
						<Loader2 className="h-3.5 w-3.5 animate-spin" />
					) : (
						<RefreshCw className="h-3.5 w-3.5" />
					)}
					{canResend ? (
						"Resend"
					) : (
						<span className="font-mono tabular-nums">
							Resend in {formatTime(timeLeft)}
						</span>
					)}
				</button>
			</div>
		</div>
	);
}

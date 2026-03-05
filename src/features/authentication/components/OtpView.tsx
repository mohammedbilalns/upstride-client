import { useRouter } from "@tanstack/react-router";
import { ArrowLeft, Loader2, RefreshCw, Timer } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { useResendOtp } from "../hooks/use-resend-otp";
import { useVerifyOtp } from "../hooks/use-verify-otp";
import type { AuthView } from "../types";

const OTP_RESEND_COOLDOWN = 60;
const OTP_EXPIRY_SECONDS = 300;
const OTP_LENGTH = 6;

interface Props {
	email: string;
	onNavigate: (view: AuthView) => void;
}

function formatTime(s: number) {
	return `${Math.floor(s / 60)
		.toString()
		.padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
}

export function OtpView({ email, onNavigate }: Props) {
	const router = useRouter();
	const [otp, setOtp] = useState("");
	const [resendTimer, setResendTimer] = useState(OTP_RESEND_COOLDOWN);
	const [expiryTimer, setExpiryTimer] = useState(OTP_EXPIRY_SECONDS);
	const [canResend, setCanResend] = useState(false);
	const [isExpired, setIsExpired] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const timersRef = useRef<{
		resend: ReturnType<typeof setInterval> | null;
		expiry: ReturnType<typeof setInterval> | null;
	}>({ resend: null, expiry: null });

	const verifyMutation = useVerifyOtp({
		onSuccess: async () => {
			await router.navigate({ to: "/home" });
		},
		onError: (err: Error | { response?: { data?: { message?: string } } }) => {
			const errorData = err as { response?: { data?: { message?: string } } };
			setError(
				errorData.response?.data?.message ||
					"Invalid or expired OTP. Please try again.",
			);
		},
	});

	const resendMutation = useResendOtp({
		onSuccess: () => {
			setOtp("");
			setError(null);
			startTimers();
		},
		onError: (err: Error | { response?: { data?: { message?: string } } }) => {
			const errorData = err as { response?: { data?: { message?: string } } };
			setError(
				errorData.response?.data?.message ||
					"Failed to resend OTP. Please try again later.",
			);
		},
	});

	const startTimers = useCallback(() => {
		// Clear existing
		if (timersRef.current.resend) clearInterval(timersRef.current.resend);
		if (timersRef.current.expiry) clearInterval(timersRef.current.expiry);

		// Reset states
		setResendTimer(OTP_RESEND_COOLDOWN);
		setExpiryTimer(OTP_EXPIRY_SECONDS);
		setCanResend(false);
		setIsExpired(false);

		// Resend Timer
		timersRef.current.resend = setInterval(() => {
			setResendTimer((prev) => {
				if (prev <= 1) {
					clearInterval(timersRef.current.resend ?? undefined);
					setCanResend(true);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		// Expiry Timer
		timersRef.current.expiry = setInterval(() => {
			setExpiryTimer((prev) => {
				if (prev <= 1) {
					clearInterval(timersRef.current.expiry ?? undefined);
					setIsExpired(true);
					setError(
						"This verification code has expired. Please request a new one.",
					);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	}, []);

	useEffect(() => {
		startTimers();
		return () => {
			if (timersRef.current.resend) clearInterval(timersRef.current.resend);
			if (timersRef.current.expiry) clearInterval(timersRef.current.expiry);
		};
	}, [startTimers]);

	async function handleVerify() {
		if (otp.length < OTP_LENGTH || isExpired) return;
		setError(null);
		verifyMutation.mutate({ email, otp });
	}

	async function handleResend() {
		if (!canResend) return;
		resendMutation.mutate(email);
	}

	return (
		<div className="space-y-6">
			<button
				type="button"
				onClick={() => onNavigate("register")}
				className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
			>
				<ArrowLeft className="h-4 w-4" />
				Back to register
			</button>

			<div className="flex justify-between items-start">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">
						Check your email
					</h2>
					<p className="text-sm text-muted-foreground mt-1">
						We sent a code to{" "}
						<span className="font-medium text-foreground">{email}</span>
					</p>
				</div>
				<div
					className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
						isExpired
							? "bg-destructive/10 text-destructive border-destructive/20"
							: "bg-primary/5 text-primary border-primary/10"
					}`}
				>
					<Timer className="h-3.5 w-3.5" />
					{isExpired ? "Expired" : `Expires in ${formatTime(expiryTimer)}`}
				</div>
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
					disabled={isExpired}
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
					<p
						className={`text-sm text-center ${isExpired ? "text-destructive font-medium" : "text-destructive"}`}
					>
						{error}
					</p>
				)}
			</div>

			<Button
				onClick={handleVerify}
				disabled={
					otp.length < OTP_LENGTH || verifyMutation.isPending || isExpired
				}
				className="w-full"
			>
				{verifyMutation.isPending && (
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
				)}
				{isExpired ? "Code Expired" : "Verify Email"}
			</Button>

			{/* Resend row with countdown */}
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
							Resend in {formatTime(resendTimer)}
						</span>
					)}
				</button>
			</div>
		</div>
	);
}

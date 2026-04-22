import { ArrowLeft, Loader2, RefreshCw, Timer } from "lucide-react";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { Button } from "@/components/ui/Button";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/InputOtp";
import { formatSecondsToClock } from "../hooks/useOtpFlow";

interface OtpVerificationPanelProps {
	backLabel: string;
	onBack: () => void;
	title: string;
	description: ReactNode;
	otp: string;
	onOtpChange: (value: string) => void;
	otpLength: number;
	error: string | null;
	isExpired?: boolean;
	expiryTimer?: number | null;
	showExpiryBadge?: boolean;
	verifyPending: boolean;
	resendPending: boolean;
	onVerify: () => void | Promise<void>;
	onResend: () => void | Promise<void>;
	canResend: boolean;
	resendTimer: number;
	verifyButtonText: string;
	expiredVerifyButtonText?: string;
	digitsOnlyPattern?: string;
}

export function OtpVerificationPanel({
	backLabel,
	onBack,
	title,
	description,
	otp,
	onOtpChange,
	otpLength,
	error,
	isExpired = false,
	expiryTimer,
	showExpiryBadge = false,
	verifyPending,
	resendPending,
	onVerify,
	onResend,
	canResend,
	resendTimer,
	verifyButtonText,
	expiredVerifyButtonText = "Code Expired",
	digitsOnlyPattern,
}: OtpVerificationPanelProps) {
	const slotIds = useMemo(
		() => Array.from({ length: otpLength }, () => crypto.randomUUID()),
		[otpLength],
	);

	return (
		<div className="space-y-6">
			<button
				type="button"
				onClick={onBack}
				className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
			>
				<ArrowLeft className="h-4 w-4" />
				{backLabel}
			</button>

			<div className="flex justify-between items-start">
				<div>
					<h2 className="text-2xl font-bold tracking-tight">{title}</h2>
					<p className="text-sm text-muted-foreground mt-1">{description}</p>
				</div>
				{showExpiryBadge && typeof expiryTimer === "number" && (
					<div
						className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
							isExpired
								? "bg-destructive/10 text-destructive border-destructive/20"
								: "bg-primary/5 text-primary border-primary/10"
						}`}
					>
						<Timer className="h-3.5 w-3.5" />
						{isExpired
							? "Expired"
							: `Expires in ${formatSecondsToClock(expiryTimer)}`}
					</div>
				)}
			</div>

			<div className="flex flex-col items-center gap-5">
				<InputOTP
					maxLength={otpLength}
					pattern={digitsOnlyPattern}
					value={otp}
					onChange={onOtpChange}
					onComplete={onVerify}
					disabled={isExpired}
				>
					<InputOTPGroup>
						{slotIds.map((id, index) => (
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
				onClick={onVerify}
				disabled={otp.length < otpLength || verifyPending || isExpired}
				className="w-full"
			>
				{verifyPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
				{isExpired ? expiredVerifyButtonText : verifyButtonText}
			</Button>

			<div className="flex items-center justify-center gap-2 text-sm">
				<span className="text-muted-foreground">Didn't receive a code?</span>
				<button
					type="button"
					disabled={!canResend || resendPending}
					onClick={onResend}
					className="flex items-center gap-1.5 font-semibold text-primary hover:underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed transition-colors"
				>
					{resendPending ? (
						<Loader2 className="h-3.5 w-3.5 animate-spin" />
					) : (
						<RefreshCw className="h-3.5 w-3.5" />
					)}
					{canResend ? (
						"Resend"
					) : (
						<span className="font-mono tabular-nums">
							Resend in {formatSecondsToClock(resendTimer)}
						</span>
					)}
				</button>
			</div>
		</div>
	);
}

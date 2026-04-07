import { ArrowRight, RotateCcw } from "lucide-react";
import FieldError from "@/components/common/Field-Error";
import { Button } from "@/components/ui/button";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { formatSecondsToClock } from "@/features/authentication/hooks/use-otp-flow";
import type { ChangePasswordStep, VerifyForm } from "./ChangePasswordModal";
import { ChangePasswordStepBadge } from "./ChangePasswordStepBadge";

interface ChangePasswordVerifyStepProps {
	form: VerifyForm;
	step: ChangePasswordStep;
	isLoading: boolean;
	canResend: boolean;
	resendTimer: number;
	onResend: () => void;
}

export function ChangePasswordVerifyStep({
	form,
	step,
	isLoading,
	canResend,
	resendTimer,
	onResend,
}: ChangePasswordVerifyStepProps) {
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			className={`space-y-4 transition-opacity duration-200 ${
				step === "request" ? "opacity-40" : "opacity-100"
			}`}
		>
			<form.Field name="otp">
				{(field) => (
					<div className="space-y-3 flex flex-col">
						<div className="flex items-center gap-2">
							<ChangePasswordStepBadge
								active={step === "verify"}
								stepNumber={2}
							/>
							<Label htmlFor={field.name}>Verification Code</Label>
						</div>
						<div className="flex justify-center py-2">
							<InputOTP
								maxLength={6}
								value={field.state.value}
								onChange={(value) => field.handleChange(value)}
								onComplete={() => form.handleSubmit()}
								disabled={step !== "verify" || isLoading}
							>
								<InputOTPGroup>
									<InputOTPSlot index={0} />
									<InputOTPSlot index={1} />
									<InputOTPSlot index={2} />
									<InputOTPSlot index={3} />
									<InputOTPSlot index={4} />
									<InputOTPSlot index={5} />
								</InputOTPGroup>
							</InputOTP>
						</div>
						<FieldError
							message={field.state.meta.errors?.[0]?.message?.toString()}
						/>
					</div>
				)}
			</form.Field>
			{step === "verify" && (
				<div className="space-y-3">
					<Button type="submit" className="w-full" disabled={isLoading}>
						{isLoading ? "Verifying..." : "Verify Code"}
						{!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
					</Button>
					<div className="flex items-center justify-center">
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="text-xs text-muted-foreground"
							disabled={!canResend || isLoading}
							onClick={onResend}
						>
							<RotateCcw className="mr-2 h-3.5 w-3.5" />
							{canResend
								? "Resend Code"
								: `Resend in ${formatSecondsToClock(resendTimer)}`}
						</Button>
					</div>
				</div>
			)}
		</form>
	);
}

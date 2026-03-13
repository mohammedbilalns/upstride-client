import { useForm } from "@tanstack/react-form";
import { ArrowRight, CheckCircle2, KeyRound, RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import FieldError from "@/components/common/Field-Error";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { PasswordField } from "@/features/authentication/components/PasswordField";
import {
	formatSecondsToClock,
	useOtpFlow,
} from "@/features/authentication/hooks/use-otp-flow";
import {
	changePasswordSchema,
	requestChangePasswordSchema,
	useChangePassword,
	useRequestChangePassword,
	useVerifyChangePasswordOtp,
	verifyChangePasswordOtpSchema,
} from "../index";

type Step = "request" | "verify" | "change" | "success";

interface ChangePasswordModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function ChangePasswordModal({
	isOpen,
	onClose,
}: ChangePasswordModalProps) {
	const [step, setStep] = useState<Step>("request");
	const [resetToken, setResetToken] = useState("");
	const [oldPassword, setOldPassword] = useState("");

	const { resendTimer, canResend, resetTimers } = useOtpFlow({
		resendCooldownSeconds: 60,
	});

	const requestMutation = useRequestChangePassword({
		onSuccess: () => {
			toast.success("OTP sent to your email");
			setStep("verify");
			resetTimers();
		},
		onError: (error: any) => {
			if (error.response?.status === 429) {
				toast.error(
					error.response?.data?.message ||
						"Too many attempts. Please try again later.",
				);
				resetModal();
				return;
			}
			toast.error(
				error.response?.data?.message || "Failed to request password change",
			);
		},
	});

	const verifyMutation = useVerifyChangePasswordOtp({
		onSuccess: (response) => {
			setResetToken(response.data.resetToken);
			setStep("change");
		},
		onError: (error: any) => {
			if (error.response?.status === 429) {
				toast.error(
					error.response?.data?.message ||
						"Too many verification attempts. Please request a new code later.",
				);
				resetModal();
				return;
			}
			toast.error(error.response?.data?.message || "Invalid OTP");
		},
	});

	const changeMutation = useChangePassword({
		onSuccess: () => {
			setStep("success");
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to change password");
		},
	});

	const isLoading =
		requestMutation.isPending ||
		verifyMutation.isPending ||
		changeMutation.isPending;

	const requestForm = useForm({
		defaultValues: { oldPassword: "" },
		onSubmit: async ({ value }) => {
			setOldPassword(value.oldPassword);
			requestMutation.mutate(value);
		},
		validators: {
			onSubmit: requestChangePasswordSchema,
		},
	});

	const verifyForm = useForm({
		defaultValues: { otp: "" },
		onSubmit: async ({ value }) => {
			verifyMutation.mutate(value);
		},
		validators: {
			onSubmit: verifyChangePasswordOtpSchema,
		},
	});

	const changeForm = useForm({
		defaultValues: { newPassword: "", confirmPassword: "" },
		onSubmit: async ({ value }) => {
			changeMutation.mutate({
				token: resetToken,
				newPassword: value.newPassword,
			});
		},
		validators: {
			onSubmit: changePasswordSchema,
		},
	});

	const handleResendOtp = () => {
		if (canResend && oldPassword) {
			requestMutation.mutate({ oldPassword });
		}
	};

	const resetModal = () => {
		setStep("request");
		setResetToken("");
		setOldPassword("");
		requestForm.reset();
		verifyForm.reset();
		changeForm.reset();
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && resetModal()}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 text-xl">
						<KeyRound className="h-5 w-5 text-primary" />
						Change Password
					</DialogTitle>
					<DialogDescription>
						Follow the steps below to securely update your password.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-8 pt-4">
					{/* Step 1: Request OTP */}
					<form
						onSubmit={(e) => {
							e.preventDefault();
							requestForm.handleSubmit();
						}}
						className={`space-y-4 transition-opacity duration-200 ${
							step !== "request" && step !== "verify" && step !== "change"
								? "opacity-50 pointer-events-none"
								: "opacity-100"
						}`}
					>
						<requestForm.Field name="oldPassword">
							{(field) => (
								<PasswordField
									id={field.name}
									label={
										<div className="flex items-center gap-2">
											<div
												className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
													step === "request"
														? "bg-primary text-primary-foreground"
														: "bg-muted text-muted-foreground"
												}`}
											>
												1
											</div>
											<span>Current Password</span>
										</div>
									}
									placeholder="••••••••"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(value) => field.handleChange(value)}
									disabled={step !== "request" || isLoading}
									error={field.state.meta.errors?.[0]?.message?.toString()}
								/>
							)}
						</requestForm.Field>
						{step === "request" && (
							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Sending..." : "Send Verification Code"}
								{!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
							</Button>
						)}
					</form>

					{/* Step 2: Verify OTP */}
					<form
						onSubmit={(e) => {
							e.preventDefault();
							verifyForm.handleSubmit();
						}}
						className={`space-y-4 transition-opacity duration-200 ${
							step === "request" ? "opacity-40" : "opacity-100"
						}`}
					>
						<verifyForm.Field name="otp">
							{(field) => (
								<div className="space-y-3 flex flex-col">
									<div className="flex items-center gap-2">
										<div
											className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
												step === "verify"
													? "bg-primary text-primary-foreground"
													: "bg-muted text-muted-foreground"
											}`}
										>
											2
										</div>
										<Label htmlFor={field.name}>Verification Code</Label>
									</div>
									<div className="flex justify-center py-2">
										<InputOTP
											maxLength={6}
											value={field.state.value}
											onChange={(value) => field.handleChange(value)}
											onComplete={() => verifyForm.handleSubmit()}
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
						</verifyForm.Field>
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
										onClick={handleResendOtp}
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

					{/* Step 3: Change Password */}
					<form
						onSubmit={(e) => {
							e.preventDefault();
							changeForm.handleSubmit();
						}}
						className={`space-y-4 transition-opacity duration-200 ${
							step !== "change" ? "opacity-40" : "opacity-100"
						}`}
					>
						<div className="flex items-center gap-2">
							<div
								className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
									step === "change"
										? "bg-primary text-primary-foreground"
										: "bg-muted text-muted-foreground"
								}`}
							>
								3
							</div>
							<span className="text-sm font-medium">Set New Password</span>
						</div>

						<changeForm.Field name="newPassword">
							{(field) => (
								<PasswordField
									id={field.name}
									label="New Password"
									placeholder="••••••••"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(value) => field.handleChange(value)}
									disabled={step !== "change" || isLoading}
									error={field.state.meta.errors?.[0]?.message?.toString()}
								/>
							)}
						</changeForm.Field>
						<changeForm.Field name="confirmPassword">
							{(field) => (
								<PasswordField
									id={field.name}
									label="Confirm New Password"
									placeholder="••••••••"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(value) => field.handleChange(value)}
									disabled={step !== "change" || isLoading}
									error={field.state.meta.errors?.[0]?.message?.toString()}
								/>
							)}
						</changeForm.Field>
						{step === "change" && (
							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Updating..." : "Update Password"}
								{!isLoading && <CheckCircle2 className="ml-2 h-4 w-4" />}
							</Button>
						)}
					</form>

					{step === "success" && (
						<div className="pt-4 flex flex-col items-center text-center animate-in fade-in zoom-in duration-300">
							<div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
								<CheckCircle2 className="h-10 w-10 text-green-600" />
							</div>
							<h3 className="text-lg font-semibold mb-2">
								Password Successfully Changed
							</h3>
							<Button onClick={resetModal} className="w-full mt-4">
								Done
							</Button>
						</div>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}

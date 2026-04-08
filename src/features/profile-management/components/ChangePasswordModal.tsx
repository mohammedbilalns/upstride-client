import { useForm } from "@tanstack/react-form";
import { KeyRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useOtpFlow } from "@/features/authentication/hooks/use-otp-flow";
import {
	changePasswordSchema,
	requestChangePasswordSchema,
	useChangePassword,
	useRequestChangePassword,
	useVerifyChangePasswordOtp,
	verifyChangePasswordOtpSchema,
} from "../index";
import { ChangePasswordChangeStep } from "./ChangePasswordChangeStep";
import { ChangePasswordRequestStep } from "./ChangePasswordRequestStep";
import { ChangePasswordSuccessStep } from "./ChangePasswordSuccessStep";
import { ChangePasswordVerifyStep } from "./ChangePasswordVerifyStep";
import { ApiError } from "@/api/apiError";

export type ChangePasswordStep = "request" | "verify" | "change" | "success";
export type RequestForm = ReturnType<typeof useForm>;
export type VerifyForm = ReturnType<typeof useForm>;
export type ChangeForm = ReturnType<typeof useForm>;

interface ChangePasswordModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function ChangePasswordModal({
	isOpen,
	onClose,
}: ChangePasswordModalProps) {
	const [step, setStep] = useState<ChangePasswordStep>("request");
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
		onError: (error: ApiError) => {
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
		onError: (error: ApiError) => {
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
		onError: (error: ApiError) => {
			toast.error(error.response?.data?.message || "Failed to change password");
		},
	});

	const isLoading =
		requestMutation.isPending ||
		verifyMutation.isPending ||
		changeMutation.isPending;

	const requestForm = useForm<{ oldPassword: string }>({
		defaultValues: { oldPassword: "" },
		onSubmit: async ({ value }) => {
			setOldPassword(value.oldPassword);
			requestMutation.mutate(value);
		},
		validators: {
			onSubmit: requestChangePasswordSchema,
		},
	});

	const verifyForm = useForm<{ otp: string }>({
		defaultValues: { otp: "" },
		onSubmit: async ({ value }) => {
			verifyMutation.mutate(value);
		},
		validators: {
			onSubmit: verifyChangePasswordOtpSchema,
		},
	});

	const changeForm = useForm<{
		newPassword: string;
		confirmPassword: string;
	}>({
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
					<ChangePasswordRequestStep
						form={requestForm}
						step={step}
						isLoading={isLoading}
					/>
					<ChangePasswordVerifyStep
						form={verifyForm}
						step={step}
						isLoading={isLoading}
						canResend={canResend}
						resendTimer={resendTimer}
						onResend={handleResendOtp}
					/>
					<ChangePasswordChangeStep
						form={changeForm}
						step={step}
						isLoading={isLoading}
					/>
					{step === "success" && (
						<ChangePasswordSuccessStep onDone={resetModal} />
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}

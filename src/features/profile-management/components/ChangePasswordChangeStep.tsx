import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PasswordField } from "@/features/authentication/components/PasswordField";
import type { ChangeForm, ChangePasswordStep } from "./ChangePasswordModal";
import { ChangePasswordStepBadge } from "./ChangePasswordStepBadge";

interface ChangePasswordChangeStepProps {
	form: ChangeForm;
	step: ChangePasswordStep;
	isLoading: boolean;
}

export function ChangePasswordChangeStep({
	form,
	step,
	isLoading,
}: ChangePasswordChangeStepProps) {
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			className={`space-y-4 transition-opacity duration-200 ${
				step !== "change" ? "opacity-40" : "opacity-100"
			}`}
		>
			<div className="flex items-center gap-2">
				<ChangePasswordStepBadge active={step === "change"} stepNumber={3} />
				<span className="text-sm font-medium">Set New Password</span>
			</div>

			<form.Field name="newPassword">
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
			</form.Field>
			<form.Field name="confirmPassword">
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
			</form.Field>
			{step === "change" && (
				<Button type="submit" className="w-full" disabled={isLoading}>
					{isLoading ? "Updating..." : "Update Password"}
					{!isLoading && <CheckCircle2 className="ml-2 h-4 w-4" />}
				</Button>
			)}
		</form>
	);
}

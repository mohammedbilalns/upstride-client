import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PasswordField } from "@/features/auth/components/PasswordField";
import type { ChangePasswordStep, RequestForm } from "./ChangePasswordModal";
import { ChangePasswordStepBadge } from "./ChangePasswordStepBadge";

interface ChangePasswordRequestStepProps {
	form: RequestForm;
	step: ChangePasswordStep;
	isLoading: boolean;
}

export function ChangePasswordRequestStep({
	form,
	step,
	isLoading,
}: ChangePasswordRequestStepProps) {
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
			className={`space-y-4 transition-opacity duration-200 ${
				step !== "request" && step !== "verify" && step !== "change"
					? "opacity-50 pointer-events-none"
					: "opacity-100"
			}`}
		>
			<form.Field name="oldPassword">
				{(field) => (
					<PasswordField
						id={field.name}
						label={
							<div className="flex items-center gap-2">
								<ChangePasswordStepBadge
									active={step === "request"}
									stepNumber={1}
								/>
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
			</form.Field>
			{step === "request" && (
				<Button type="submit" className="w-full" disabled={isLoading}>
					{isLoading ? "Sending..." : "Send Verification Code"}
					{!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
				</Button>
			)}
		</form>
	);
}

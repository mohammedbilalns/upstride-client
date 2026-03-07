import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResetPassword } from "../hooks/use-reset-password";
import type { AuthView } from "../types";
import { changePasswordSchema } from "../validators";
import { PasswordField } from "./PasswordField";

interface Props {
	email: string;
	resetToken: string;
	onNavigate: (view: AuthView) => void;
}

export function ChangePasswordView({ email, resetToken, onNavigate }: Props) {
	const resetPasswordMutation = useResetPassword({
		onSuccess: () => {
			onNavigate("login");
		},
	});

	const form = useForm({
		defaultValues: { password: "", confirmPassword: "" },
		validators: {
			onSubmit: changePasswordSchema,
		},
		onSubmit: async ({ value }) => {
			resetPasswordMutation.mutate({
				tempToken: resetToken,
				email,
				newPassword: value.password,
			});
		},
	});

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold tracking-tight">Set new password</h2>
				<p className="text-sm text-muted-foreground mt-1">
					Choose a strong password for your account.
				</p>
			</div>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
				className="space-y-4"
			>
				<form.Field name="password">
					{(field) => (
						<PasswordField
							id={field.name}
							label="New Password"
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={field.handleChange}
							autoComplete="new-password"
							error={field.state.meta.errors?.[0]?.message}
						/>
					)}
				</form.Field>

				<form.Field name="confirmPassword">
					{(field) => (
						<PasswordField
							id={field.name}
							label="Confirm Password"
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={field.handleChange}
							autoComplete="new-password"
							error={field.state.meta.errors?.[0]?.message}
						/>
					)}
				</form.Field>

				{/* Live password strength hints */}
				<form.Field name="password">
					{(field) => (
						<ul className="text-xs space-y-1 pl-1">
							{[
								{
									label: "At least 8 characters",
									test: field.state.value.length >= 8,
								},
								{
									label: "One uppercase letter",
									test: /[A-Z]/.test(field.state.value),
								},
								{
									label: "One lowercase letter",
									test: /[a-z]/.test(field.state.value),
								},
								{ label: "One number", test: /[0-9]/.test(field.state.value) },
								{
									label: "One special character",
									test: /[^a-zA-Z0-9]/.test(field.state.value),
								},
							].map(({ label, test }) => (
								<li
									key={label}
									className={test ? "text-green-500" : "text-muted-foreground"}
								>
									{test ? "✓" : "•"} {label}
								</li>
							))}
						</ul>
					)}
				</form.Field>

				<form.Subscribe selector={(s) => s.isSubmitting}>
					{(isSubmitting) => (
						<Button type="submit" className="w-full" disabled={isSubmitting}>
							{isSubmitting && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							Reset Password
						</Button>
					)}
				</form.Subscribe>
			</form>
		</div>
	);
}

import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FieldError from "@/components/common/Field-Error";
import { changePasswordSchema } from "../validators";

interface Props {
	resetToken: string;
}

export function ChangePasswordView({ resetToken }: Props) {
	const router = useRouter();
	const [showPass, setShowPass] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [success, setSuccess] = useState(false);

	const form = useForm({
		defaultValues: { password: "", confirmPassword: "" },
		validators: {
			onSubmit: changePasswordSchema,
		},
		onSubmit: async ({ value }) => {
			// TODO: call reset-password API with resetToken + value.password
			console.log({ resetToken, password: value.password });
			setSuccess(true);
			setTimeout(() => router.navigate({ to: "/auth" }), 1800);
		},
	});

	if (success) {
		return (
			<div className="text-center space-y-4 py-8">
				<div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
					<svg
						className="h-8 w-8 text-green-500"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M5 13l4 4L19 7"
						/>
					</svg>
				</div>
				<h2 className="text-2xl font-bold tracking-tight">Password reset!</h2>
				<p className="text-sm text-muted-foreground">
					Your password has been updated. Redirecting to login…
				</p>
			</div>
		);
	}

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
						<div className="space-y-1.5">
							<Label htmlFor={field.name}>New Password</Label>
							<div className="relative">
								<Input
									id={field.name}
									type={showPass ? "text" : "password"}
									placeholder="••••••••"
									autoComplete="new-password"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
								<button
									type="button"
									tabIndex={-1}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
									onClick={() => setShowPass((p) => !p)}
								>
									{showPass ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</button>
							</div>
							<FieldError message={field.state.meta.errors?.[0]?.message} />
						</div>
					)}
				</form.Field>

				<form.Field name="confirmPassword">
					{(field) => (
						<div className="space-y-1.5">
							<Label htmlFor={field.name}>Confirm Password</Label>
							<div className="relative">
								<Input
									id={field.name}
									type={showConfirm ? "text" : "password"}
									placeholder="••••••••"
									autoComplete="new-password"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
								<button
									type="button"
									tabIndex={-1}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
									onClick={() => setShowConfirm((p) => !p)}
								>
									{showConfirm ? (
										<EyeOff className="h-4 w-4" />
									) : (
										<Eye className="h-4 w-4" />
									)}
								</button>
							</div>
							<FieldError message={field.state.meta.errors?.[0]?.message} />
						</div>
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
								{ label: "One number", test: /[0-9]/.test(field.state.value) },
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

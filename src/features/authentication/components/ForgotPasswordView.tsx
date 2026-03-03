import { useForm } from "@tanstack/react-form";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AuthView } from "../types";
import { forgotPasswordSchema } from "../validators";

interface Props {
	onNavigate: (view: AuthView, email?: string) => void;
}

export function ForgotPasswordView({ onNavigate }: Props) {
	const form = useForm({
		defaultValues: { email: "" },
		validators: {
			onSubmit: forgotPasswordSchema,
		},
		onSubmit: async ({ value }) => {
			// TODO: call request-password-reset API
			console.log(value);
			onNavigate("forgot-password-otp", value.email);
		},
	});

	return (
		<div className="space-y-6">
			<button
				type="button"
				onClick={() => onNavigate("login")}
				className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
			>
				<ArrowLeft className="h-4 w-4" />
				Back to login
			</button>

			<div>
				<h2 className="text-2xl font-bold tracking-tight">Forgot password?</h2>
				<p className="text-sm text-muted-foreground mt-1">
					Enter your email address and we'll send you a reset code.
				</p>
			</div>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
				className="space-y-4"
			>
				<form.Field name="email">
					{(field) => (
						<div className="space-y-1.5">
							<Label htmlFor={field.name}>Email address</Label>
							<Input
								id={field.name}
								type="email"
								placeholder="you@example.com"
								autoComplete="email"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
							{field.state.meta.errors?.[0] && (
								<p className="text-xs text-destructive mt-1">
									{field.state.meta.errors[0].message}
								</p>
							)}
						</div>
					)}
				</form.Field>

				<form.Subscribe selector={(s) => s.isSubmitting}>
					{(isSubmitting) => (
						<Button type="submit" className="w-full" disabled={isSubmitting}>
							{isSubmitting && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							Send Reset Code
						</Button>
					)}
				</form.Subscribe>
			</form>
		</div>
	);
}

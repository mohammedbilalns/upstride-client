import { useForm } from "@tanstack/react-form";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import FieldError from "@/components/common/Field-Error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRequestPasswordReset } from "../hooks/use-request-password-reset";
import type { AuthView } from "../types";
import { forgotPasswordSchema } from "../validators";
import type { ApiError } from "@/api/apiError";

interface Props {
	onNavigate: (view: AuthView, email?: string) => void;
}

export function ForgotPasswordView({ onNavigate }: Props) {
	const [apiError, setApiError] = useState<string | null>(null);

	const requestResetMutation = useRequestPasswordReset({
		onSuccess: () => {
			onNavigate("forgot-password-otp", form.state.values.email);
		},
		onError: (error: ApiError) => {
			const message =
				error.response?.data?.message ||
				"Something went wrong. Please try again.";
			setApiError(message);
		},
	});

	const form = useForm({
		defaultValues: { email: "" },
		validators: {
			onSubmit: forgotPasswordSchema,
		},
		onSubmit: async ({ value }) => {
			setApiError(null);
			requestResetMutation.mutate(value);
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

			{apiError && (
				<div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-1">
					{apiError}
				</div>
			)}

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
							<FieldError message={field.state.meta.errors?.[0]?.message} />
						</div>
					)}
				</form.Field>

				<form.Subscribe selector={(s) => s.isSubmitting}>
					{(isSubmitting) => (
						<Button
							type="submit"
							className="w-full"
							disabled={isSubmitting || requestResetMutation.isPending}
						>
							{(isSubmitting || requestResetMutation.isPending) && (
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

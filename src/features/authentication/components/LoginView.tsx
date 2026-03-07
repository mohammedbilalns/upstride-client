import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import FieldError from "@/components/common/Field-Error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useLogin } from "../hooks/use-login";
import type { AuthView } from "../types";
import { loginSchema } from "../validators";
import { PasswordField } from "./PasswordField";
import { SocialAuthButtons } from "./SocialAuthButtons";

interface Props {
	onNavigate: (view: AuthView) => void;
}

export function LoginView({ onNavigate }: Props) {
	const router = useRouter();
	const [apiError, setApiError] = useState<string | null>(null);

	const loginMutation = useLogin({
		onSuccess: async ({ user }) => {
			if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
				await router.navigate({ to: "/dashboard" });
			} else {
				await router.navigate({ to: "/home" });
			}
		},
		onError: (
			error: Error | { response?: { data?: { message?: string } } },
		) => {
			const errorData = error as { response?: { data?: { message?: string } } };
			const message =
				errorData.response?.data?.message ||
				"Invalid credentials. Please try again.";
			setApiError(message);
		},
	});

	const form = useForm({
		defaultValues: { email: "", password: "" },
		onSubmit: async ({ value }) => {
			setApiError(null);
			const result = loginSchema.safeParse(value);
			if (!result.success) return;
			loginMutation.mutate(result.data);
		},
		validators: {
			onSubmit: loginSchema,
		},
	});

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
				<p className="text-sm text-muted-foreground mt-1">
					Sign in to your account to continue
				</p>
			</div>

			{apiError && (
				<div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-1">
					{apiError}
				</div>
			)}

			<SocialAuthButtons />

			<div className="flex items-center gap-3">
				<Separator className="flex-1" />
				<span className="text-xs text-muted-foreground">
					or continue with email
				</span>
				<Separator className="flex-1" />
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
							<Label htmlFor={field.name}>Email</Label>
							<Input
								id={field.name}
								type="email"
								placeholder="john@example.com"
								autoComplete="email"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
							<FieldError message={field.state.meta.errors?.[0]?.message} />
						</div>
					)}
				</form.Field>

				<form.Field name="password">
					{(field) => (
						<PasswordField
							id={field.name}
							label="Password"
							value={field.state.value}
							onBlur={field.handleBlur}
							onChange={field.handleChange}
							autoComplete="current-password"
							error={field.state.meta.errors?.[0]?.message}
							labelAction={
								<button
									type="button"
									onClick={() => onNavigate("forgot-password")}
									className="text-xs text-primary hover:underline"
								>
									Forgot password?
								</button>
							}
						/>
					)}
				</form.Field>

				<form.Subscribe selector={(s) => s.isSubmitting}>
					{(isSubmitting) => (
						<Button
							type="submit"
							className="w-full"
							disabled={isSubmitting || loginMutation.isPending}
						>
							{(isSubmitting || loginMutation.isPending) && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							Sign in
						</Button>
					)}
				</form.Subscribe>
			</form>

			<p className="text-sm text-center text-muted-foreground">
				Don't have an account?{" "}
				<button
					type="button"
					onClick={() => onNavigate("register")}
					className="text-primary font-semibold hover:underline"
				>
					Create account
				</button>
			</p>
		</div>
	);
}

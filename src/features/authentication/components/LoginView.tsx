import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { AuthView } from "../types";
import { loginSchema } from "../validators";
import FieldError from "@/components/common/Field-Error";
import { SocialAuthButtons } from "./SocialAuthButtons";

interface Props {
	onNavigate: (view: AuthView) => void;
}

export function LoginView({ onNavigate }: Props) {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);

	const form = useForm({
		defaultValues: { email: "", password: "" },
		onSubmit: async ({ value }) => {
			const result = loginSchema.safeParse(value);
			if (!result.success) return;
			// TODO: call login API
			console.log(result.data);
			await router.navigate({ to: "/home" });
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
						<div className="space-y-1.5">
							<div className="flex justify-between items-center">
								<Label htmlFor={field.name}>Password</Label>
								<button
									type="button"
									onClick={() => onNavigate("forgot-password")}
									className="text-xs text-primary hover:underline"
								>
									Forgot password?
								</button>
							</div>
							<div className="relative">
								<Input
									id={field.name}
									type={showPassword ? "text" : "password"}
									placeholder="••••••••"
									autoComplete="current-password"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
								<button
									type="button"
									tabIndex={-1}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
									onClick={() => setShowPassword((p) => !p)}
								>
									{showPassword ? (
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

				<form.Subscribe selector={(s) => s.isSubmitting}>
					{(isSubmitting) => (
						<Button type="submit" className="w-full" disabled={isSubmitting}>
							{isSubmitting && (
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

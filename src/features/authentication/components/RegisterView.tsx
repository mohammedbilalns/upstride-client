import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { AuthView } from "../types";
import { registerSchema } from "../validators";
import FieldError from "@/components/common/Field-Error";
import { useRegister } from "../hooks/use-register";
import { SocialAuthButtons } from "./SocialAuthButtons";

interface Props {
	onNavigate: (view: AuthView, email?: string) => void;
}

export function RegisterView({ onNavigate }: Props) {
	const [showPass, setShowPass] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [apiError, setApiError] = useState<string | null>(null);

	const registration = useRegister({
		onSuccess: (email) => {
			onNavigate("register-otp", email);
		},
		onError: (error: any) => {
			const message =
				error.response?.data?.message ||
				"Registration failed. Please try again.";
			setApiError(message);
		},
	});

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			phone: "",
			password: "",
			confirmPassword: "",
		},
		validators: {
			onSubmit: registerSchema,
		},
		onSubmit: async ({ value }) => {
			setApiError(null);
			const { confirmPassword, ...payload } = value;
			registration.mutate(payload);
		},
	});

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold tracking-tight">Create an account</h2>
				<p className="text-sm text-muted-foreground mt-1">
					Join thousands of learners and mentors on UpStride
				</p>
			</div>

			<SocialAuthButtons />

			<div className="flex items-center gap-3">
				<Separator className="flex-1" />
				<span className="text-xs text-muted-foreground">
					or sign up with email
				</span>
				<Separator className="flex-1" />
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
				<form.Field name="name">
					{(field) => (
						<div className="space-y-1.5">
							<Label htmlFor={field.name}>Full Name</Label>
							<Input
								id={field.name}
								placeholder="John Doe"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
							<FieldError message={field.state.meta.errors?.[0]?.message} />
						</div>
					)}
				</form.Field>

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

				<form.Field name="phone">
					{(field) => (
						<div className="space-y-1.5">
							<Label htmlFor={field.name}>Phone Number</Label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground font-medium text-sm">
									+91
								</div>
								<Input
									id={field.name}
									type="tel"
									className="pl-11"
									placeholder="5550000000"
									autoComplete="tel"
									value={
										field.state.value
											? field.state.value.replace(/^\+91\s*/, "")
											: ""
									}
									onBlur={field.handleBlur}
									onChange={(e) => {
										const digits = e.target.value.replace(/\D/g, "");
										field.handleChange(digits ? `+91 ${digits}` : "");
									}}
								/>
							</div>
							<FieldError message={field.state.meta.errors?.[0]?.message} />
						</div>
					)}
				</form.Field>

				<div className="grid grid-cols-2 gap-3">
					<form.Field name="password">
						{(field) => (
							<div className="space-y-1.5">
								<Label htmlFor={field.name}>Password</Label>
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
								<Label htmlFor={field.name}>Confirm</Label>
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
				</div>

				<form.Subscribe selector={(s) => s.isSubmitting}>
					{(isSubmitting) => (
						<Button
							type="submit"
							className="w-full"
							disabled={isSubmitting || registration.isPending}
						>
							{(isSubmitting || registration.isPending) && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							Create Account
						</Button>
					)}
				</form.Subscribe>
			</form>

			<p className="text-sm text-center text-muted-foreground">
				Already have an account?{" "}
				<button
					type="button"
					onClick={() => onNavigate("login")}
					className="text-primary font-semibold hover:underline"
				>
					Sign in
				</button>
			</p>
		</div>
	);
}

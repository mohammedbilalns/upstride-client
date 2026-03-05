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

interface Props {
	onNavigate: (view: AuthView, email?: string) => void;
}

function SocialAuthButtons() {
	return (
		<div className="grid grid-cols-2 gap-3">
			<Button
				type="button"
				variant="outline"
				className="flex items-center gap-2 font-medium border-border hover:bg-muted/60 transition-colors"
				onClick={() => console.log("Google OAuth")}
			>
				<svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24">
					<path
						d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
						fill="#4285F4"
					/>
					<path
						d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
						fill="#34A853"
					/>
					<path
						d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
						fill="#FBBC05"
					/>
					<path
						d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
						fill="#EA4335"
					/>
				</svg>
				Google
			</Button>

			<Button
				type="button"
				variant="outline"
				className="flex items-center gap-2 font-medium border-border hover:bg-muted/60 transition-colors"
				onClick={() => console.log("LinkedIn OAuth")}
			>
				<svg
					className="h-4 w-4 flex-shrink-0 text-[#0A66C2]"
					viewBox="0 0 24 24"
					fill="currentColor"
				>
					<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
				</svg>
				LinkedIn
			</Button>
		</div>
	);
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
							<Input
								id={field.name}
								type="tel"
								placeholder="+91 5550000000"
								autoComplete="tel"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
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

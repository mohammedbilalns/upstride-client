import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import type { ApiError } from "@/api/apiError";
import FieldError from "@/components/common/FieldError";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/Separator";
import type { UserRole } from "@/shared/types/user";
import { getErrorMessage } from "@/shared/utils/formValidation";
import { useDummyLogin } from "../hooks/mutations/useDummyLogin";
import { useLogin } from "../hooks/mutations/useLogin";
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
	const handleAuthSuccess = async ({ user }: { user: { role: UserRole } }) => {
		if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
			await router.navigate({ to: "/dashboard" });
		} else {
			await router.navigate({ to: "/home" });
		}
	};

	const loginMutation = useLogin({
		onSuccess: handleAuthSuccess,
		onError: (error: ApiError) => {
			const message =
				error.response?.data?.message ||
				"Invalid credentials. Please try again.";
			setApiError(message);
		},
	});

	const dummyLoginMutation = useDummyLogin({
		onSuccess: handleAuthSuccess,
		onError: (error: ApiError) => {
			const message =
				error.response?.data?.message ||
				"Unable to sign in with dummy credentials.";
			setApiError(message);
		},
	});

	const form = useForm({
		defaultValues: { email: "", password: "" },
		onSubmit: async ({ value }) => {
			setApiError(null);
			loginMutation.mutate(value);
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

			<SocialAuthButtons onNavigate={onNavigate} showLinkedIn={false} />

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
				className="flex flex-col gap-5"
			>
				<form.Field name="email">
					{(field) => (
						<div className="flex flex-col gap-2">
							<Label htmlFor={field.name}>Email</Label>
							<Input
								id={field.name}
								placeholder="john@example.com"
								autoComplete="email"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
							<FieldError
								message={
									field.state.meta.isTouched
										? getErrorMessage(field.state.meta.errors?.[0])
										: undefined
								}
							/>
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
							error={getErrorMessage(field.state.meta.errors?.[0])}
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
						<div className="flex flex-col gap-3">
							<Button
								type="submit"
								className="w-full"
								disabled={
									isSubmitting ||
									loginMutation.isPending ||
									dummyLoginMutation.isPending
								}
							>
								{(isSubmitting || loginMutation.isPending) && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								Sign in
							</Button>

							<Button
								type="button"
								variant="secondary"
								className="w-full"
								disabled={
									isSubmitting ||
									loginMutation.isPending ||
									dummyLoginMutation.isPending
								}
								onClick={() => {
									setApiError(null);
									dummyLoginMutation.mutate();
								}}
							>
								{dummyLoginMutation.isPending && (
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								)}
								Try as Guest
							</Button>
						</div>
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

import { z } from "zod";

export const forgotPasswordSchema = z.object({
	email: z.string().email("Please enter a valid email"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const changePasswordSchema = z
	.object({
		password: z
			.string()
			.min(8, "Password must be at least 8 characters")
			.regex(/[A-Z]/, "Must contain at least one uppercase letter")
			.regex(/[0-9]/, "Must contain at least one number"),
		confirmPassword: z.string(),
	})
	.refine((d) => d.password === d.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

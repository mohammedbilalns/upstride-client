import { z } from "zod";
import { passwordSchema as passwordSchema_1 } from "@/shared/validators/password.schema";

export const forgotPasswordSchema = z.object({
	email: z.email("Please enter a valid email").trim(),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const changePasswordSchema = z
	.object({
		password: passwordSchema_1,
		confirmPassword: z.string(),
	})
	.refine((d) => d.password === d.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

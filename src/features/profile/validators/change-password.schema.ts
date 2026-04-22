import { z } from "zod";
import { passwordSchema } from "@/shared/validators/password.schema";

export const requestChangePasswordSchema = z.object({
	oldPassword: z.string().min(1, "Old password is required"),
});

export const verifyChangePasswordOtpSchema = z.object({
	otp: z.string().length(6, "OTP must be 6 digits"),
});

export const changePasswordSchema = z
	.object({
		newPassword: passwordSchema,
		confirmPassword: z.string().min(1, "Confirm password is required"),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

import { z } from "zod";
import {
	isPasswordEqual,
	passwordSchema,
} from "@/shared/validators/password.schema";

export const forgotPasswordSchema = z.object({
	email: z.email("Please enter a valid email").trim(),
});

export const changePasswordSchema = z
	.object({
		password: passwordSchema,
		confirmPassword: z.string(),
	})
	.refine(isPasswordEqual, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

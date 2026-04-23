import { z } from "zod";
import {
	isPasswordEqual,
	passwordSchema,
} from "@/shared/validators/password.schema";
import { phoneSchema } from "@/shared/validators/phone.schema";
import { nameSchema } from "@/shared/validators/name.schema";

export const registerSchema = z
	.object({
		name: nameSchema,
		email: z.email("Please enter a valid email").trim(),
		phone: phoneSchema,
		password: passwordSchema,
		confirmPassword: z.string(),
	})
	.refine(isPasswordEqual, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type RegisterFormValues = z.infer<typeof registerSchema>;

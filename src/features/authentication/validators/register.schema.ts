import * as passwordSchema from "@/shared/validators/password.schema";
import { z } from "zod";

export const registerSchema = z
	.object({
		name: z.string().trim().min(2, "Name must be at least 2 characters"),
		email: z.email("Please enter a valid email"),
		phone: z
			.string()
			.min(7, "Phone number is too short")
			.regex(/^\+?[0-9\s\-()]+$/, "Invalid phone number"),
		password: passwordSchema.passwordSchema,
		confirmPassword: z.string(),
	})
	.refine((d) => d.password === d.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type RegisterPayload = Omit<RegisterFormValues, "confirmPassword">;

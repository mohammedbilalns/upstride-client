import { z } from "zod";
import { passwordSchema } from "@/shared/validators/password.schema";
import { phoneSchema } from "@/shared/validators/phone.schema";

export const registerSchema = z
	.object({
		name: z.string().trim().min(2, "Name must be at least 2 characters"),
		email: z.email("Please enter a valid email").trim(),
		phone: phoneSchema,
		password: passwordSchema,
		confirmPassword: z.string(),
	})
	.refine((d) => d.password === d.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type RegisterPayload = Omit<RegisterFormValues, "confirmPassword">;

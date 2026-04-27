import { z } from "zod";
import { passwordSchema } from "@/shared/validators/password.schema";

export const loginSchema = z.object({
	email: z.email("Please enter a valid email").trim(),
	password: passwordSchema,
});

export type LoginFormValues = z.infer<typeof loginSchema>;

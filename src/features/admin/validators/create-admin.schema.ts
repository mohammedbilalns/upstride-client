import { z } from "zod";
import { passwordSchema } from "@/shared/validators/password.schema";

export const createAdminSchema = z.object({
	email: z.email("Please enter a valid email").trim(),
	password: passwordSchema,
});

export type CreateAdminFormValues = z.infer<typeof createAdminSchema>;

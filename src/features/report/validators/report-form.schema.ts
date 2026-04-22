import { z } from "zod";

export const reportFormSchema = z.object({
	reason: z.string().min(1, "Please select a reason"),
	description: z
		.string()
		.min(10, "Please provide at least 10 characters")
		.max(500),
});

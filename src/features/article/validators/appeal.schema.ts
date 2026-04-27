import { z } from "zod";

export const appealSchema = z.object({
	message: z
		.string()
		.trim()
		.min(10, "Appeal message must be at least 10 characters long")
		.max(1000, "Appeal message must be at most 1000 characters long"),
});

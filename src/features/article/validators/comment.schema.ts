import { z } from "zod";

export const commentSchema = z.object({
	content: z
		.string()
		.trim()
		.min(2, "Comment must be at least 2 characters")
		.max(500, "Comment is too long (max 500 characters)"),
});

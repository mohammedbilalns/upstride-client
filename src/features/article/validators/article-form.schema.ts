import { z } from "zod";

export const articleSchema = z.object({
	title: z
		.string()
		.trim()
		.min(20, "Title must be at least 20 characters")
		.max(200, "Title is too long"),
	content: z
		.string()
		.trim()
		.min(200, "Content must be at least 200 characters")
		.max(50000, "Content is too long"),
	featuredImageUrl: z.string().optional().or(z.literal("")),
	tags: z
		.array(z.string().trim().min(1))
		.max(6, "Maximum 6 tags allowed")
		.optional(),
});

export type ArticleFormValues = z.infer<typeof articleSchema>;

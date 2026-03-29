import { z } from "zod";

export const articleCreateSchema = z.object({
	title: z
		.string()
		.min(5, "Title must be at least 5 characters long")
		.max(100, "Title is too long"),
	description: z
		.string()
		.min(10, "Description must be at least 10 characters long"),
	content: z.string().min(20, "Content is too short"),
	featuredImageUrl: z.string().optional().or(z.literal("")),
	tags: z.array(z.string()).min(1, "At least one category is required"),
});

export const articleUpdateSchema = articleCreateSchema.partial().extend({
	articleId: z.string().min(1, "Article ID is required"),
});

export type ArticleCreateInput = z.infer<typeof articleCreateSchema>;
export type ArticleUpdateInput = z.infer<typeof articleUpdateSchema>;

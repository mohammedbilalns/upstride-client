import { z } from "zod";

export const articleSearchSchema = z.object({
	page: z.number().catch(1),
	search: z.string().optional(),
	skill: z.string().optional(),
	category: z.string().optional(),
});

export type ArticleSearch = z.infer<typeof articleSearchSchema>;

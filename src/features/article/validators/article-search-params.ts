import { z } from "zod";

export const articleSearchSchema = z.object({
	search: z.string().optional(),
	skill: z.string().optional(),
	category: z.string().optional(),
});

export type ArticleSearch = z.infer<typeof articleSearchSchema>;

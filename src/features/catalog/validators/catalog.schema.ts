import { z } from "zod";

export const catalogItemNameSchema = z
	.string()
	.trim()
	.min(2, "Name must be at least 2 characters")
	.max(50, "Name must be at most 50 characters");

export const catalogInterestSchema = z.object({
	name: catalogItemNameSchema,
});

export const catalogSkillSchema = z.object({
	name: catalogItemNameSchema,
	interestId: z.string("Invalid interest ID"),
});

export const catalogProfessionSchema = z.object({
	name: catalogItemNameSchema,
});

export const catalogUpdateSchema = z.object({
	name: catalogItemNameSchema,
});

export const catalogSearchSchema = z.object({
	tab: z.enum(["interests", "professions"]).catch("interests").optional(),
});

import { nameSchema } from "@/shared/validators/name.schema";
import { z } from "zod";

export const catalogInterestSchema = z.object({
	name: nameSchema,
});

export const catalogSkillSchema = z.object({
	name: nameSchema,
	interestId: z.string("Invalid interest ID"),
});

export const catalogProfessionSchema = z.object({
	name: nameSchema,
});

export const catalogUpdateSchema = z.object({
	name: nameSchema,
});

export const catalogItemNameSchema = catalogUpdateSchema;

export const catalogSearchSchema = z.object({
	tab: z.enum(["interests", "professions"]).catch("interests").optional(),
});

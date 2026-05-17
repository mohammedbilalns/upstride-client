import { z } from "zod";
import { searchSchema } from "@/shared/validators/pagination.schema";
import { MentorLanguageCodes } from "@/shared/constants/language.constants";

export const MentorDiscoverySearchSchema = z.object({
	search: searchSchema,
	category: z.string().optional().catch(undefined),
	languages: z.preprocess((value) => {
		if (value === undefined || value === null) return undefined;
		return Array.isArray(value) ? value : [value];
	}, z.array(z.enum(MentorLanguageCodes)).optional()),
	tierId: z.string().optional().catch(undefined),
	minExperience: z.number().int().nonnegative().optional().catch(undefined),
	maxExperience: z.number().int().nonnegative().optional().catch(undefined),
	sort: z.enum(["rating", "recent"]).optional().catch(undefined),
});

export type MentorDiscoverySearch = z.infer<typeof MentorDiscoverySearchSchema>;

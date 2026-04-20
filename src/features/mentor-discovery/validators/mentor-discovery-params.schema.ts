import { z } from "zod";
import { searchSchema } from "@/shared/validators/pagination.schema";

export const MentorDiscoverySearchSchema = z.object({
	search: searchSchema,
	category: z.string().optional().catch(undefined),
	tierId: z.string().optional().catch(undefined),
	minExperience: z.number().int().nonnegative().optional().catch(undefined),
	maxExperience: z.number().int().nonnegative().optional().catch(undefined),
	sort: z.enum(["rating", "recent"]).catch("rating"),
});

export type MentorDiscoverySearch = z.infer<typeof MentorDiscoverySearchSchema>;

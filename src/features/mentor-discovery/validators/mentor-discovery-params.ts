import { z } from "zod";

export const MentorDiscoverySearchSchema = z.object({
	search: z.string().optional().catch(undefined),
	categoryId: z.string().optional().catch(undefined),
	tierId: z.string().optional().catch(undefined),
	minExperience: z.number().int().nonnegative().optional().catch(undefined),
	maxExperience: z.number().int().nonnegative().optional().catch(undefined),
	sort: z.enum(["rating", "recent"]).catch("rating"),
});

export type MentorDiscoverySearch = z.infer<typeof MentorDiscoverySearchSchema>;

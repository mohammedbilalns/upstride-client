import { z } from "zod";

export const MentorManagementSearchSchema = z.object({
	page: z.number().int().positive().catch(1),
	limit: z
		.number()
		.int()
		.refine((val) => [10, 20, 50].includes(val))
		.catch(10),
	status: z
		.enum(["approved", "rejected", "pending"])
		.optional()
		.catch(undefined),
	sort: z.enum(["recent", "old", "status"]).catch("recent"),
});

export type MentorManagementSearch = z.infer<
	typeof MentorManagementSearchSchema
>;

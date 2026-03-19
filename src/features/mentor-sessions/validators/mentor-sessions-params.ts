import { z } from "zod";

export const MentorSessionsSearchSchema = z.object({
	filter: z.enum(["upcoming", "cancelled"]).catch("upcoming"),
	page: z.number().int().positive().catch(1),
	limit: z
		.number()
		.int()
		.refine((val) => [10, 20, 50].includes(val), {
			message: "Limit must be 10, 20 or 50",
		})
		.catch(10),
});

export type MentorSessionsSearch = z.infer<typeof MentorSessionsSearchSchema>;

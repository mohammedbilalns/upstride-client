import { z } from "zod";

export const SessionsSearchSchema = z.object({
	tab: z.enum(["upcoming", "past"]).catch("upcoming"),
	page: z.number().int().positive().catch(1),
	limit: z
		.number()
		.int()
		.refine((val) => [10, 20, 50].includes(val), {
			message: "Limit must be 10, 20 or 50",
		})
		.catch(10),
	upcomingFilter: z.enum(["upcoming", "cancelled"]).catch("upcoming"),
});

export type SessionsSearch = z.infer<typeof SessionsSearchSchema>;

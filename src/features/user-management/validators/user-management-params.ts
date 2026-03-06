import { z } from "zod";

export const UserManagementSearchSchema = z.object({
	page: z.number().int().positive().catch(1),
	limit: z
		.number()
		.int()
		.refine((val) => [10, 20, 50].includes(val))
		.catch(10),
	search: z.string().optional().catch(""),
	role: z.enum(["USER", "MENTOR"]).optional().catch(undefined),
	status: z.enum(["active", "blocked"]).optional().catch(undefined),
	sort: z.enum(["recent", "old"]).catch("recent"),
});

export type UserManagementSearch = z.infer<typeof UserManagementSearchSchema>;

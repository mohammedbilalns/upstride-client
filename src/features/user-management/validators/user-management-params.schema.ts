import { z } from "zod";
import {
	limitSchema,
	pageSchema,
	searchSchema,
} from "@/shared/validators/pagination.schema";

export const UserManagementSearchSchema = z.object({
	page: pageSchema,
	limit: limitSchema,
	search: searchSchema,
	role: z.enum(["USER", "MENTOR"]).optional().catch(undefined),
	status: z.enum(["active", "blocked"]).optional().catch(undefined),
	sort: z.enum(["recent", "old"]).catch("recent"),
});

export type UserManagementSearch = z.infer<typeof UserManagementSearchSchema>;

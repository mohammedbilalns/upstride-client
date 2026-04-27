import { z } from "zod";
import {
	limitSchema,
	pageSchema,
	searchSchema,
} from "@/shared/validators/pagination.schema";

export const AdminManagementSearchSchema = z.object({
	page: pageSchema,
	limit: limitSchema,
	search: searchSchema,
	status: z.enum(["active", "blocked"]).optional().catch(undefined),
	sort: z.enum(["recent", "old"]).catch("recent"),
});

export type AdminManagementSearch = z.infer<typeof AdminManagementSearchSchema>;

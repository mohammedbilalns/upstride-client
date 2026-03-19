import { z } from "zod";
import { limitSchema, pageSchema } from "@/shared/validators/pagination.schema";

export const MentorManagementSearchSchema = z.object({
	page: pageSchema,
	limit: limitSchema,
	status: z
		.enum(["approved", "rejected", "pending"])
		.optional()
		.catch(undefined),
	sort: z.enum(["recent", "old", "status"]).catch("recent"),
});

export type MentorManagementSearch = z.infer<
	typeof MentorManagementSearchSchema
>;

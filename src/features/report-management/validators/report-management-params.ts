import { z } from "zod";
import { limitSchema, pageSchema } from "@/shared/validators/pagination.schema";

export const ReportManagementSearchSchema = z.object({
	page: pageSchema,
	limit: limitSchema,
	status: z
		.enum(["PENDING", "RESOLVED", "REJECTED", "CLOSED"])
		.optional()
		.catch(undefined),
	targetType: z.enum(["USER", "ARTICLE"]).optional().catch(undefined),
	isAppealSubmitted: z.boolean().optional().catch(undefined),
});

export type ReportManagementSearch = z.infer<
	typeof ReportManagementSearchSchema
>;

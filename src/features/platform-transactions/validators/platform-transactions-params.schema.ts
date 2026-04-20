import { z } from "zod";
import { limitSchema, pageSchema } from "@/shared/validators/pagination.schema";

export const PlatformTransactionsSearchSchema = z.object({
	paymentPage: pageSchema,
	paymentLimit: limitSchema,
	paymentSort: z.enum(["recent", "old"]).catch("recent"),
	paymentStatus: z
		.enum(["pending", "completed", "failed", "refunded"])
		.optional()
		.catch(undefined),
});

export type PlatformTransactionsSearch = z.infer<
	typeof PlatformTransactionsSearchSchema
>;

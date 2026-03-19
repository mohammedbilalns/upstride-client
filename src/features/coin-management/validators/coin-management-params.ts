import { z } from "zod";
import { limitSchema, pageSchema } from "@/shared/validators/pagination.schema";

export const CoinManagementSearchSchema = z.object({
	tab: z.enum(["coins", "payments"]).catch("coins"),
	coinPage: pageSchema,
	coinLimit: limitSchema,
	coinSort: z.enum(["recent", "old"]).catch("recent"),
	coinType: z
		.enum([
			"purchase",
			"session_spend",
			"session_earning",
			"appreciation_spend",
			"appreciation_earning",
			"article_reward",
			"signup_bonus",
			"refund",
		])
		.optional()
		.catch(undefined),
	paymentPage: pageSchema,
	paymentLimit: limitSchema,
	paymentSort: z.enum(["recent", "old"]).catch("recent"),
	paymentStatus: z
		.enum(["pending", "completed", "failed", "refunded"])
		.optional()
		.catch(undefined),
});

export type CoinManagementSearch = z.infer<typeof CoinManagementSearchSchema>;

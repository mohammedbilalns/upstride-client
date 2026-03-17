import { z } from "zod";

const limitSchema = z
	.number()
	.int()
	.refine((val) => [10, 20, 50].includes(val))
	.catch(10);

export const CoinManagementSearchSchema = z.object({
	tab: z.enum(["coins", "payments"]).catch("coins"),
	coinPage: z.number().int().positive().catch(1),
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
	paymentPage: z.number().int().positive().catch(1),
	paymentLimit: limitSchema,
	paymentSort: z.enum(["recent", "old"]).catch("recent"),
	paymentStatus: z
		.enum(["pending", "completed", "failed", "refunded"])
		.optional()
		.catch(undefined),
});

export type CoinManagementSearch = z.infer<typeof CoinManagementSearchSchema>;

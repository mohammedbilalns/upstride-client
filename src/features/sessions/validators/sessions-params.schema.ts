import { z } from "zod";
import { limitSchema, pageSchema } from "@/shared/validators/pagination.schema";

export const SessionsSearchSchema = z.object({
	tab: z.enum(["upcoming", "past"]).catch("upcoming"),
	page: pageSchema,
	limit: limitSchema,
	filter: z
		.enum([
			"upcoming",
			"payment_pending",
			"upcoming_cancelled",
			"past",
			"completed",
			"past_cancelled",
		])
		.catch("upcoming"),
	booking_success: z.boolean().optional(),
	booking_id: z.string().optional(),
});

export type SessionsSearch = z.infer<typeof SessionsSearchSchema>;

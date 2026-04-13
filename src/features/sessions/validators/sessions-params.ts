import { z } from "zod";
import { limitSchema, pageSchema } from "@/shared/validators/pagination.schema";

export const SessionsSearchSchema = z.object({
	tab: z.enum(["upcoming", "past"]).catch("upcoming"),
	page: pageSchema,
	limit: limitSchema,
	upcomingFilter: z
		.enum(["upcoming", "cancelled", "payment_pending"])
		.catch("upcoming"),
	booking_success: z.boolean().optional(),
	booking_id: z.string().optional(),
});

export type SessionsSearch = z.infer<typeof SessionsSearchSchema>;

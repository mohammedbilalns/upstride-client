import { z } from "zod";
import { limitSchema, pageSchema } from "@/shared/validators/pagination.schema";

export const SessionsSearchSchema = z.object({
	tab: z.enum(["upcoming", "past"]).catch("upcoming"),
	page: pageSchema,
	limit: limitSchema,
	upcomingFilter: z.enum(["upcoming", "cancelled"]).catch("upcoming"),
});

export type SessionsSearch = z.infer<typeof SessionsSearchSchema>;

import { z } from "zod";
import { limitSchema, pageSchema } from "@/shared/validators/pagination.schema";

export const MentorSessionsSearchSchema = z.object({
	filter: z.enum(["upcoming", "past", "cancelled"]).catch("upcoming"),
	page: pageSchema,
	limit: limitSchema,
});

export type MentorSessionsSearch = z.infer<typeof MentorSessionsSearchSchema>;

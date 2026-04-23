import { nameSchema } from "@/shared/validators/name.schema";
import { z } from "zod";

export const profileUpdateSchema = z.object({
	name: nameSchema,
	profilePictureId: z.string().optional(),
});

export type ProfileUpdatePayload = z.infer<typeof profileUpdateSchema>;

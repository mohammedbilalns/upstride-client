import { z } from "zod";
import { nameSchema } from "@/shared/validators/name.schema";

export const profileUpdateSchema = z.object({
	name: nameSchema,
	profilePictureId: z.string().optional(),
});

export type ProfileUpdatePayload = z.infer<typeof profileUpdateSchema>;

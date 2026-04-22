import { z } from "zod";

export const profileUpdateSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Name must be at least 2 characters")
		.max(50, "Name must be at most 50 characters"),
	profilePictureId: z.string().optional(),
});

export type ProfileUpdatePayload = z.infer<typeof profileUpdateSchema>;

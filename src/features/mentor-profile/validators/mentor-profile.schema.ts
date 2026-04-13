import { z } from "zod";

export const mentorProfileSchema = z.object({
	currentPricePer30Min: z
		.string()
		.refine(
			(value) =>
				value === "" ||
				(!Number.isNaN(Number(value)) &&
					Number.isInteger(Number(value)) &&
					Number(value) >= 100 &&
					Number(value) <= 10000),
			{
				message: "Price must be a whole number between 100 and 10000",
			},
		),
	bio: z.string().trim().min(10, "Bio must be at least 10 characters"),
	newSkillId: z.string(),
	newSkillLevel: z.string(),
	newQualification: z.string(),
});

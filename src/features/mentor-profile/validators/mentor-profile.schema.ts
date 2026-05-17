import { z } from "zod";
import { MentorLanguageCodes } from "@/shared/constants/language.constants";

export const MAX_MENTOR_AREAS_OF_EXPERTISE = 2;

export const mentorProfileSchema = z.object({
	currentRoleId: z.string().trim().min(1, "Current role is required"),
	organization: z.string().trim().min(1, "Organization is required"),
	areasOfExpertise: z
		.array(z.string().trim().min(1, "Area of interest is required"))
		.min(1, "Select at least one area of interest")
		.max(MAX_MENTOR_AREAS_OF_EXPERTISE, "Select up to 2 areas of interest"),
	languages: z
		.array(z.enum(MentorLanguageCodes))
		.min(1, "Select at least one language"),
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

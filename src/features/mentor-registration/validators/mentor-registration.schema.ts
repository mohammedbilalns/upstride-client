import { z } from "zod";
import { SkillLevelValues } from "@/shared/types/user";

export const MAX_MENTOR_AREAS_OF_EXPERTISE = 2;
export const MAX_MENTOR_EXPERIENCE_ITEMS = 7;

export const mentorExperienceSchema = z.object({
	company: z.string().trim().min(1, "Company name is required"),
	role: z.string().trim().min(1, "Role is required"),
	description: z.string().trim().min(1, "Description is required"),
	from: z.string().trim().min(1, "Start date is required"),
	to: z
		.string()
		.trim()
		.nullable()
		.refine((val) => val !== "", {
			message: "End date must be a valid date or empty for current",
		}),
});

export const mentorSkillSchema = z.object({
	skillId: z.string().trim().min(1, "Please select a skill from the list"),
	level: z.enum([...SkillLevelValues] as [string, ...string[]], {
		message: "Please select a skill level",
	}),
});

export const RegisterMentorSchema = z.object({
	bio: z.string().trim().min(10, "Bio must be at least 10 characters long"),
	currentRoleId: z.string().trim().min(1, "Please select your current role"),
	organization: z.string().trim().min(1, "Organization name is required"),
	yearsOfExperience: z
		.number({ message: "Years of experience is required" })
		.min(0, "Years of experience cannot be negative"),
	personalWebsite: z
		.string()
		.trim()
		.url("Please enter a valid URL (e.g., https://example.com)")
		.or(z.literal("")),
	resumeId: z.string().trim().min(1, "Please upload your resume"),
	educationalQualifications: z
		.array(z.string().trim().min(1, "Qualification details cannot be empty"))
		.min(1, "At least one qualification is required"),
	areasOfExpertise: z
		.array(z.string().trim().min(1, "Please select an area of expertise"))
		.min(1, "At least one area of expertise is required")
		.max(
			MAX_MENTOR_AREAS_OF_EXPERTISE,
			`Maximum of ${MAX_MENTOR_AREAS_OF_EXPERTISE} areas of expertise allowed`,
		),
	toolsAndSkills: z
		.array(mentorSkillSchema)
		.min(1, "At least one skill is required"),
	experience: z
		.array(mentorExperienceSchema)
		.min(1, "At least one experience item is required")
		.max(
			MAX_MENTOR_EXPERIENCE_ITEMS,
			`Maximum of ${MAX_MENTOR_EXPERIENCE_ITEMS} experience items allowed`,
		),
});

export const ResubmitMentorSchema = RegisterMentorSchema.partial();

export type MentorRegistrationValues = z.infer<typeof RegisterMentorSchema>;

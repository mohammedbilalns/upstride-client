import { z } from "zod";
import { UserPreferencesLimits } from "@/features/onboarding/validators/onboarding.schema";

export const profilePreferencesSchema = z.object({
	interests: z
		.array(z.string().min(1, "Interest ID is required"))
		.min(
			UserPreferencesLimits.MIN_INTERESTS,
			`Select at least ${UserPreferencesLimits.MIN_INTERESTS} interests`,
		)
		.max(
			UserPreferencesLimits.MAX_INTERESTS,
			`Select at most ${UserPreferencesLimits.MAX_INTERESTS} interests`,
		),
	skills: z
		.array(z.string().min(1, "Skill ID is required"))
		.min(
			UserPreferencesLimits.MIN_SKILLS_PER_INTEREST,
			`Select at least ${UserPreferencesLimits.MIN_SKILLS_PER_INTEREST} skills`,
		)
		.max(
			UserPreferencesLimits.MAX_INTERESTS *
				UserPreferencesLimits.MAX_SKILLS_PER_INTEREST,
			"Too many skills selected",
		),
});

export type ProfilePreferencesFormValues = z.infer<
	typeof profilePreferencesSchema
>;

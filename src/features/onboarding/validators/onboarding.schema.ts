import { z } from "zod";

const MIN_INTERESTS = 2;
const MAX_INTERESTS = 5;
const MIN_SKILLS_PER_INTEREST = 2;
const MAX_SKILLS_PER_INTEREST = 10;

export const saveInterestsSchema = z.object({
	setupToken: z.string().min(1, "Setup token is required"),
	interests: z
		.array(z.string().min(1, "Interest name is required"))
		.min(MIN_INTERESTS, `Select at least ${MIN_INTERESTS} interests`)
		.max(MAX_INTERESTS, `Select at most ${MAX_INTERESTS} interests`),
	skills: z
		.array(
			z.object({
				skillId: z.string().min(1, "Skill ID is required"),
				level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"], {
					message: "Invalid skill level",
				}),
			}),
		)
		.min(
			MIN_SKILLS_PER_INTEREST,
			`Select at least ${MIN_SKILLS_PER_INTEREST} skills`,
		)
		.max(MAX_INTERESTS * MAX_SKILLS_PER_INTEREST, "Too many skills selected"),
});

export type SaveInterestsFormValues = z.infer<typeof saveInterestsSchema>;
export type SaveInterestsPayload = SaveInterestsFormValues;

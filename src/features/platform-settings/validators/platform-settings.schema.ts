import { z } from "zod";
import {
	nonNegativeIntSchema,
	percentageSchema,
	positiveIntSchema,
} from "@/shared/validators/number.schema";

const PositiveNumberSchema = z.coerce
	.number("Please enter a valid number")
	.positive("Value must be greater than 0");

export const PlatformCommissionsSchema = z.object({
	sessionPercentage: percentageSchema,
	userTipRewardPercentage: percentageSchema,
});

export const SubscriptionPlanSchema = z.object({
	id: z.string().min(1),
	coinsCost: positiveIntSchema,
	type: z.enum(["monthly", "quarterly", "yearly"]),
});

export const economySettingsSchema = z.object({
	coinValue: PositiveNumberSchema,
	platformCommissions: PlatformCommissionsSchema,
	subscriptions: z.array(SubscriptionPlanSchema),
	userJoinRewardCoinCount: nonNegativeIntSchema,
	maxCoinsEarnablePerDay: nonNegativeIntSchema,
	maxCoinsFromReadingPerDay: nonNegativeIntSchema,
	maxCoinsFromEngagementPerDay: nonNegativeIntSchema,
});

export const MentorTierSchema = z.object({
	level: z.number().int().min(1).max(3),
	name: z.string().trim().min(1, "Name is required"),
	minScore: nonNegativeIntSchema.max(100, "Min score must be at most 100"),
	maxScore: nonNegativeIntSchema.max(100, "Max score must be at most 100"),
	maxPricePer30Min: nonNegativeIntSchema
		.min(100, "Max price per 30 min must be at least 100")
		.max(10000, "Max price per 30 min must be at most 10000"),
});

export const mentorSettingsSchema = z
	.object({
		starter: MentorTierSchema,
		rising: MentorTierSchema,
		expert: MentorTierSchema,
	})
	.refine(
		(value) =>
			value.starter.level === 1 &&
			value.rising.level === 2 &&
			value.expert.level === 3,
		{
			message: "Mentor tier levels must be Starter(1), Rising(2), Expert(3)",
		},
	)
	.refine(
		(value) => {
			const names = new Set([
				value.starter.name,
				value.rising.name,
				value.expert.name,
			]);
			return names.size === 3;
		},
		{ message: "Tier names must be unique" },
	)
	.refine(
		(value) => {
			const tiers = [value.starter, value.rising, value.expert];
			for (const tier of tiers) {
				if (tier.maxScore <= tier.minScore) {
					return false;
				}
			}
			for (let i = 1; i < tiers.length; i += 1) {
				const prev = tiers[i - 1];
				const curr = tiers[i];
				if (curr.minScore < prev.maxScore) {
					return false;
				}
				if (curr.maxScore <= prev.maxScore) {
					return false;
				}
			}
			return true;
		},
		{
			message: "Mentor tiers must be ordered for score ranges",
		},
	);

export const premiumArticleRequirementSchema = z.object({
	minFreeArticlesNewUserShouldHave: nonNegativeIntSchema,
	minArticleViews: nonNegativeIntSchema,
	minLikes: nonNegativeIntSchema,
});

export const feedSettingsSchema = z.object({
	trendingWindowHours: positiveIntSchema,
	minimumEngagementForTrending: nonNegativeIntSchema,
	articleDecayRate: nonNegativeIntSchema,
});

export const contentSettingsSchema = z.object({
	premiumArticleRequirement: premiumArticleRequirementSchema,
	feed: feedSettingsSchema,
});

export const platformSettingsSearchSchema = z.object({
	tab: z
		.enum(["economy", "mentors", "content", "sessions"])
		.optional()
		.catch("economy"),
});

export type PlatformSettingsSearch = z.infer<
	typeof platformSettingsSearchSchema
>;

export const sessionSettingsSchema = z.object({
	cancellationWindowHours: nonNegativeIntSchema,
	rescheduleWindowHours: nonNegativeIntSchema,
	maxSessionsPerDayPerMentor: positiveIntSchema,
});

import {
	nonNegativeIntSchema,
	percentageSchema,
	positiveIntSchema,
} from "@/shared/validators/number.schema";
import { z } from "zod";

const positiveNumberSchema = z.coerce
	.number("Please enter a valid number")
	.positive("Value must be greater than 0");

export const platformCommissionsSchema = z.object({
	sessionPercentage: percentageSchema,
	userTipRewardPercentage: percentageSchema,
});

export const subscriptionPlanSchema = z.object({
	id: z.string().min(1),
	coinsCost: positiveIntSchema,
	type: z.enum(["monthly", "quarterly", "yearly"]),
});

export const economySettingsSchema = z.object({
	coinValue: positiveNumberSchema,
	platformCommissions: platformCommissionsSchema,
	subscriptions: z.array(subscriptionPlanSchema),
	userJoinRewardCoinCount: nonNegativeIntSchema,
	maxCoinsEarnablePerDay: nonNegativeIntSchema,
	maxCoinsFromReadingPerDay: nonNegativeIntSchema,
	maxCoinsFromEngagementPerDay: nonNegativeIntSchema,
});

export const mentorTierSchema = z.object({
	level: z.number().int().min(1).max(4),
	name: z.string().trim().min(1, "Name is required"),
	rateForThirtyMinSession: nonNegativeIntSchema,
	minFreeArticlesPercentage: percentageSchema,
	maxArticlesPerWeek: nonNegativeIntSchema,
	minSessionCompleted: nonNegativeIntSchema,
	minArticlesPublished: nonNegativeIntSchema,
});

export const mentorSettingsSchema = z
	.object({
		starter: mentorTierSchema,
		rising: mentorTierSchema,
		expert: mentorTierSchema,
		elite: mentorTierSchema,
	})
	.refine(
		(value) =>
			value.starter.level === 1 &&
			value.rising.level === 2 &&
			value.expert.level === 3 &&
			value.elite.level === 4,
		{
			message:
				"Mentor tier levels must be Starter(1), Rising(2), Expert(3), Elite(4)",
		},
	)
	.refine(
		(value) => {
			const names = new Set([
				value.starter.name,
				value.rising.name,
				value.expert.name,
				value.elite.name,
			]);
			return names.size === 4;
		},
		{ message: "Tier names must be unique" },
	)
	.refine(
		(value) => {
			const tiers = [value.starter, value.rising, value.expert, value.elite];
			for (let i = 1; i < tiers.length; i += 1) {
				const prev = tiers[i - 1];
				const curr = tiers[i];
				if (curr.rateForThirtyMinSession <= prev.rateForThirtyMinSession) {
					return false;
				}
				if (curr.maxArticlesPerWeek <= prev.maxArticlesPerWeek) {
					return false;
				}
				if (curr.minSessionCompleted <= prev.minSessionCompleted) {
					return false;
				}
				if (curr.minArticlesPublished <= prev.minArticlesPublished) {
					return false;
				}
				if (curr.minFreeArticlesPercentage >= prev.minFreeArticlesPercentage) {
					return false;
				}
			}
			return true;
		},
		{
			message:
				"Mentor tiers must be strictly ordered for rates, limits, minimums, and free-article percentage",
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

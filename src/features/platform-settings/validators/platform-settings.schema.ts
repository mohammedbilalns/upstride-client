import {
	nonNegativeIntSchema,
	percentageSchema,
	positiveIntSchema,
} from "@/shared/validators/number.schema";
import { z } from "zod";

export const purchaseRateSchema = z
	.object({
		price: positiveIntSchema,
		coinsCount: positiveIntSchema,
	})
	.refine((value) => value.price <= value.coinsCount, {
		message: "Price must be less than or equal to coins count",
	});

export const payoutRateSchema = z
	.object({
		coinsCountFrom: positiveIntSchema,
		coinsCountTo: positiveIntSchema,
		payoutPerCoinRate: percentageSchema,
	})
	.refine((value) => value.coinsCountTo > value.coinsCountFrom, {
		message: "Coins count to must be greater than coins count from",
	});

export const subscriptionPlanSchema = z.object({
	id: z.string().min(1),
	coinsCost: positiveIntSchema,
	type: z.enum(["monthly", "quarterly", "yearly"]),
});

export const economySettingsSchema = z.object({
	purchaseRates: z.array(purchaseRateSchema),
	payoutRates: z.array(payoutRateSchema),
	subscriptions: z.array(subscriptionPlanSchema),
	userJoinRewardCoinCount: nonNegativeIntSchema,
	maxCoinsEarnablePerDay: nonNegativeIntSchema,
	maxCoinsFromReadingPerDay: nonNegativeIntSchema,
	maxCoinsFromEngagementPerDay: nonNegativeIntSchema,
});

export const mentorTierSchema = z.object({
	id: z.string().trim().min(1),
	name: z.string().trim().min(1, "Name is required"),
	rateForThirtyMinSession: nonNegativeIntSchema,
	rateForSixtyMinSession: nonNegativeIntSchema,
	minFreeArticlesPercentage: percentageSchema,
	maxArticlesPerWeek: nonNegativeIntSchema,
	minSessionCompleted: nonNegativeIntSchema,
	minArticlesPublished: nonNegativeIntSchema,
});

export const mentorSettingsSchema = z.object({
	tiers: z.array(mentorTierSchema),
});

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
	platformFeePercentage: percentageSchema,
});

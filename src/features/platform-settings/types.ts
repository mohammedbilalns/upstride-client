export interface PurchaseRate {
	price: number;
	coinsCount: number;
	revenuePercentage?: number;
}

export interface PayoutRate {
	coinsCountFrom: number;
	coinsCountTo: number;
	payoutPerCoinRate: number;
}

export interface SubscriptionPlan {
	id: string;
	coinsCost: number;
	type: "monthly" | "quarterly" | "yearly";
}

export interface EconomySettingsConfig {
	purchaseRates: PurchaseRate[];
	payoutRates: PayoutRate[];
	subscriptions: SubscriptionPlan[];
	userJoinRewardCoinCount: number;
	maxCoinsEarnablePerDay: number;
	maxCoinsFromReadingPerDay: number;
	maxCoinsFromEngagementPerDay: number;
}

export interface MentorTier {
	id: string;
	name: string;
	rateForThirtyMinSession: number;
	rateForSixtyMinSession: number;
	minFreeArticlesPercentage: number;
	maxArticlesPerWeek: number;
	minSessionCompleted: number;
	minArticlesPublished: number;
}

export interface MentorSettingsConfig {
	tiers: MentorTier[];
}

export interface PremiumArticleRequirement {
	minFreeArticlesNewUserShouldHave: number;
	minArticleViews: number;
	minLikes: number;
}

export interface FeedSettingsConfig {
	trendingWindowHours: number;
	minimumEngagementForTrending: number;
	articleDecayRate: number;
}

export interface ContentSettingsConfig {
	premiumArticleRequirement: PremiumArticleRequirement;
	feed: FeedSettingsConfig;
}

export interface SessionSettingsConfig {
	cancellationWindowHours: number;
	rescheduleWindowHours: number;
	maxSessionsPerDayPerMentor: number;
	platformFeePercentage: number;
}

export interface FetchPlatformSettingsResponse {
	message: string;
	data: {
		economy: EconomySettingsConfig;
		mentors: MentorSettingsConfig;
		content: ContentSettingsConfig;
		sessions: SessionSettingsConfig;
	};
}

export interface UpdateEconomySettingsInput {
	economy: EconomySettingsConfig;
}

export interface UpdateEconomySettingsResponse {
	message: string;
	data: {
		economy: EconomySettingsConfig;
	};
}

export interface UpdateMentorSettingsInput {
	mentors: MentorSettingsConfig;
}

export interface UpdateMentorSettingsResponse {
	message: string;
	data: {
		mentors: MentorSettingsConfig;
	};
}

export interface UpdateContentSettingsInput {
	content: ContentSettingsConfig;
}

export interface UpdateContentSettingsResponse {
	message: string;
	data: {
		content: ContentSettingsConfig;
	};
}

export interface UpdateSessionSettingsInput {
	sessions: SessionSettingsConfig;
}

export interface UpdateSessionSettingsResponse {
	message: string;
	data: {
		sessions: SessionSettingsConfig;
	};
}

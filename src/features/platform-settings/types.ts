export interface PlatformCommissions {
	sessionPercentage: number;
	userTipRewardPercentage: number;
}

export interface SubscriptionPlan {
	id: string;
	coinsCost: number;
	type: "monthly" | "quarterly" | "yearly";
}

export interface EconomySettingsConfig {
	coinValue: number;
	platformCommissions: PlatformCommissions;
	subscriptions: SubscriptionPlan[];
	userJoinRewardCoinCount: number;
	maxCoinsEarnablePerDay: number;
	maxCoinsFromReadingPerDay: number;
	maxCoinsFromEngagementPerDay: number;
}

export enum MentorTierLevel {
	Starter = 1,
	Rising = 2,
	Expert = 3,
	Elite = 4,
}

export interface MentorTier {
	level: MentorTierLevel;
	name: string;
	rateForThirtyMinSession: number;
	minFreeArticlesPercentage: number;
	maxArticlesPerWeek: number;
	minSessionCompleted: number;
	minArticlesPublished: number;
}

export interface MentorSettingsConfig {
	starter: MentorTier;
	rising: MentorTier;
	expert: MentorTier;
	elite: MentorTier;
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

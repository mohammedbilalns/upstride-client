export type DashboardRole = "USER" | "MENTOR";
export type DashboardPeriod = "week" | "month" | "year";

export interface DashboardGrowthMetric {
	current: number;
	previous: number;
	changePercent: number;
}

export interface DashboardTopCategory {
	id: string;
	name: string;
	count: number;
}

export interface DashboardUpcomingSession {
	id: string;
	startTime: string;
	endTime: string;
	status: string;
	paymentStatus: string;
	mentorName: string | null;
	menteeName: string | null;
	totalAmount: number;
	currency: string;
}

export interface DashboardActivityItem {
	id: string;
	type: "SESSION_BOOKED" | "SESSION_COMPLETED" | "SAVED_MENTOR";
	title: string;
	description: string;
	occurredAt: string;
}

export interface DashboardArticle {
	id: string;
	slug: string;
	title: string;
	description: string;
	featuredImageUrl: string;
	views: number;
	createdAt: string;
}

export interface DashboardReview {
	id: string;
	reviewerName: string;
	rating: number;
	comment: string;
	createdAt: string;
}

export interface DashboardActivityOverview {
	period: DashboardPeriod;
	labels: string[];
	sessions: number[];
	hoursLearned: number[];
	earnings?: number[];
}

export interface DashboardEarningsChart {
	period: DashboardPeriod;
	labels: string[];
	values: number[];
}

export interface DashboardSummary {
	role: DashboardRole;
	upcomingSessionsCount: number;
	completedSessionCount: number;
	hoursLearned: number;
	articlesRead?: number;
	totalRevenue?: number;
	platformFees?: number;
	netEarnings?: number;
	earningsCurrency?: string;
	totalSessionsAttended?: number;
	averageRating?: number;
	totalMentees?: number;
	consistentLoginDays: number;
	topCategory?: DashboardTopCategory | null;
	sessionGrowth: DashboardGrowthMetric;
	hoursLearnedGrowth: DashboardGrowthMetric;
	upcomingSessions: DashboardUpcomingSession[];
	recentActivity: DashboardActivityItem[];
	recommendedArticles: DashboardArticle[];
	earningsChart?: DashboardEarningsChart;
	recentReviews?: DashboardReview[];
	totalAverageRating?: number;
}

export interface DashboardViewModel extends DashboardSummary {
	totalAverageRating: number;
	recentReviews: DashboardReview[];
}

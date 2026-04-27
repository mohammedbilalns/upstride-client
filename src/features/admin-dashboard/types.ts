export type AdminDashboardPeriod = "week" | "month" | "year" | "custom";

export interface AdminDashboardChartQuery {
	period: AdminDashboardPeriod;
	startDate?: string;
	endDate?: string;
}

export interface AdminDashboardMetric {
	total: number;
	current: number;
	previous: number;
	changePercent: number;
}

export interface AdminDashboardSparkline {
	labels: string[];
	values: number[];
}

export interface AdminDashboardUserGrowthPoint {
	label: string;
	users: number;
	mentors: number;
}

export interface AdminDashboardUserGrowthResponse {
	period: AdminDashboardPeriod;
	labels: string[];
	series: AdminDashboardUserGrowthPoint[];
}

export interface AdminDashboardRevenuePoint {
	label: string;
	value: number;
}

export interface AdminDashboardRevenueBreakdown {
	effectiveRevenue: number;
	platformWalletBalance: number;
	upcomingSessionLiability: number;
}

export interface AdminDashboardRevenueAnalyticsResponse {
	period: AdminDashboardPeriod;
	labels: string[];
	series: AdminDashboardRevenuePoint[];
	breakdown: AdminDashboardRevenueBreakdown;
}

export interface AdminDashboardSessionOverviewResponse {
	totalSessions: number;
	completed: number;
	upcoming: number;
	cancelled: number;
	completionRate: number;
	cancellationRate: number;
}

export interface AdminDashboardTopMentor {
	mentorId: string;
	name: string;
	revenue: number;
	changePercent: number;
}

export interface AdminDashboardTopCategory {
	categoryId: string;
	name: string;
	sessions: number;
	sharePercent: number;
}

export interface HealthCheckResult {
	status: "up" | "down";
	latencyMs: number;
	details?: string;
}

export interface SystemHealthSnapshot {
	status: "ok" | "degraded";
	timestamp: string;
	uptimeSeconds: number;
	dependencies: {
		mongo: HealthCheckResult;
		redis: HealthCheckResult;
	};
	services: {
		notificationQueue: HealthCheckResult;
	};
}

export interface AdminDashboardResponse {
	metrics: {
		totalUsers: AdminDashboardMetric;
		totalMentors: AdminDashboardMetric;
		totalSessions: AdminDashboardMetric;
		totalRevenue: AdminDashboardMetric;
	};
	topMentors: AdminDashboardTopMentor[];
	topCategories: AdminDashboardTopCategory[];
	systemHealth: SystemHealthSnapshot;
}

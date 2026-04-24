import type {
	DashboardReviewDto,
	DashboardSummaryDto,
	DashboardViewModel,
} from "../types";

const fallbackRecentReviews: DashboardReviewDto[] = [
	{
		id: "fallback-review-1",
		reviewerName: "John Doe",
		rating: 5,
		comment: "Great session. Very helpful and structured.",
		createdAt: new Date().toISOString(),
	},
	{
		id: "fallback-review-2",
		reviewerName: "Sarah Williams",
		rating: 5,
		comment: "Explained concepts clearly and answered every question.",
		createdAt: new Date().toISOString(),
	},
	{
		id: "fallback-review-3",
		reviewerName: "Mike Johnson",
		rating: 4,
		comment: "Useful guidance and practical examples.",
		createdAt: new Date().toISOString(),
	},
];

export function mapDashboardSummary(
	summary: DashboardSummaryDto,
): DashboardViewModel {
	return {
		...summary,
		totalAverageRating:
			summary.totalAverageRating ?? summary.averageRating ?? 4.8,
		recentReviews: summary.recentReviews?.length
			? summary.recentReviews
			: fallbackRecentReviews,
	};
}

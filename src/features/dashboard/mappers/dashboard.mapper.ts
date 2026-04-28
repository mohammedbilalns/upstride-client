import type { DashboardSummary, DashboardViewModel } from "../types";

export function mapDashboardSummary(
	summary: DashboardSummary,
): DashboardViewModel {
	return {
		...summary,
		totalAverageRating:
			summary.totalAverageRating ?? summary.averageRating ?? 4.8,
		recentReviews: summary.recentReviews ?? [],
	};
}

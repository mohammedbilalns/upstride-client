import type { DashboardSummaryDto, DashboardViewModel } from "../types";

export function mapDashboardSummary(
	summary: DashboardSummaryDto,
): DashboardViewModel {
	return {
		...summary,
		totalAverageRating:
			summary.totalAverageRating ?? summary.averageRating ?? 4.8,
		recentReviews: summary.recentReviews ?? [],
	};
}

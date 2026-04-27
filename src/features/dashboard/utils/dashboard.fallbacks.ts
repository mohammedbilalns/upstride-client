import type { DashboardActivityOverviewDto, DashboardPeriod } from "../types";

export function fallbackOverview(
	period: DashboardPeriod,
): DashboardActivityOverviewDto {
	return {
		period,
		labels: [],
		sessions: [],
		hoursLearned: [],
	};
}

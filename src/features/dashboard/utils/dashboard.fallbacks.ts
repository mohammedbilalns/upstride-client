import type { DashboardActivityOverview, DashboardPeriod } from "../types";

export function fallbackOverview(
	period: DashboardPeriod,
): DashboardActivityOverview {
	return {
		period,
		labels: [],
		sessions: [],
		hoursLearned: [],
	};
}

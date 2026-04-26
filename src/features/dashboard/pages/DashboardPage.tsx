import { useState } from "react";
import { ActivityOverviewPanel } from "../components/ActivityOverviewPanel";
import { DashboardHero } from "../components/DashboardHero";
import { EarningsPanel } from "../components/EarningsPanel";
import { InsightsPanel } from "../components/InsightsPanel";
import { RecentActivityPanel } from "../components/RecentActivityPanel";
import { RecommendedArticlesPanel } from "../components/RecommendedArticlesPanel";
import { ReviewsPanel } from "../components/ReviewsPanel";
import { SessionSummaryPanel } from "../components/SessionSummaryPanel";
import { UpcomingSessionsPanel } from "../components/UpcomingSessionsPanel";
import {
	useDashboardActivityOverviewQuery,
	useDashboardQuery,
} from "../hooks/queries/useDashboard";
import { mapDashboardSummary } from "../mappers/dashboard.mapper";
import type { DashboardPeriod, DashboardRole } from "../types";
import {
	fallbackOverview,
	formatNumber,
	formatUnitAmount,
} from "../utils/dashboard.utils";

interface DashboardPageProps {
	displayName: string;
	dashboardRole: DashboardRole;
}

export function DashboardPage({
	displayName,
	dashboardRole,
}: DashboardPageProps) {
	const [period, setPeriod] = useState<DashboardPeriod>("month");
	const { data: summaryData, isLoading: summaryLoading } =
		useDashboardQuery(dashboardRole);
	const { data: overviewData, isFetching: overviewFetching } =
		useDashboardActivityOverviewQuery(dashboardRole, period);

	const dashboard = summaryData ? mapDashboardSummary(summaryData) : null;
	const activityOverview = overviewData ?? fallbackOverview(period);
	const isMentor = dashboard?.role === "MENTOR" || dashboardRole === "MENTOR";
	const sessionLabel = dashboard
		? `${formatNumber(dashboard.totalSessionsAttended ?? dashboard.completedSessionCount, 0)} sessions attended`
		: undefined;
	const heroHighlights = dashboard
		? isMentor
			? [
					{
						label: "Revenue",
						value: formatUnitAmount(
							dashboard.netEarnings ?? dashboard.totalRevenue ?? 0,
							dashboard.earningsCurrency ?? "COINS",
						),
						subtitle: "Credited after completed sessions",
					},
					{
						label: "Mentees",
						value: formatNumber(dashboard.totalMentees ?? 0, 0),
						subtitle: "Unique learners",
					},
					{
						label: "Rating",
						value: formatNumber(
							dashboard.totalAverageRating ?? dashboard.averageRating ?? 4.8,
							1,
						),
						subtitle: "Overall average",
					},
				]
			: [
					{
						label: "Upcoming",
						value: formatNumber(dashboard.upcomingSessionsCount, 0),
						subtitle: "Scheduled sessions",
					},
					{
						label: "Completed",
						value: formatNumber(dashboard.completedSessionCount, 0),
						subtitle: "Finished sessions",
					},
					{
						label: "Hours",
						value: formatNumber(dashboard.hoursLearned, 1),
						subtitle: "Learned this period",
					},
				]
		: [];
	if (summaryLoading && !dashboard) {
		return (
			<div className="p-6 md:p-8">
				<div className="rounded-3xl border border-border/60 bg-card p-8 text-muted-foreground">
					Loading dashboard...
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-[90rem] space-y-3 p-2.5 md:p-4 animate-in fade-in duration-500">
			<DashboardHero
				displayName={displayName}
				dashboardRole={dashboardRole}
				sessionLabel={sessionLabel}
				highlights={heroHighlights}
			/>

			<div className="grid grid-cols-1 items-stretch gap-2.5 xl:grid-cols-[1.2fr_0.8fr]">
				<UpcomingSessionsPanel
					dashboardRole={dashboardRole}
					sessions={dashboard?.upcomingSessions.slice(0, 2) ?? []}
				/>
				<InsightsPanel
					dashboardRole={dashboardRole}
					consistentLoginDays={dashboard?.consistentLoginDays ?? 0}
					topCategory={dashboard?.topCategory}
					averageRating={
						dashboard?.totalAverageRating ?? dashboard?.averageRating
					}
				/>
			</div>

			<div className="grid grid-cols-1 gap-2.5 xl:grid-cols-[1.15fr_0.95fr_1fr]">
				<RecentActivityPanel
					items={dashboard?.recentActivity.slice(0, 3) ?? []}
					dashboardRole={dashboardRole}
				/>
				<SessionSummaryPanel dashboard={dashboard} />
				<RecommendedArticlesPanel
					articles={dashboard?.recommendedArticles.slice(0, 3) ?? []}
				/>
			</div>

			<div className="grid grid-cols-1 gap-2.5">
				<ActivityOverviewPanel
					activityOverview={activityOverview}
					period={period}
					setPeriod={setPeriod}
					isFetching={overviewFetching}
				/>
			</div>

			{isMentor && dashboard && (
				<div className="grid grid-cols-1 gap-2.5 xl:grid-cols-[1.25fr_0.85fr]">
					<EarningsPanel dashboard={dashboard} />
					<ReviewsPanel
						reviews={dashboard.recentReviews.slice(0, 3)}
						rating={dashboard.totalAverageRating}
					/>
				</div>
			)}
		</div>
	);
}

import { CalendarDays, CircleDollarSign } from "lucide-react";
import { useMemo, useState } from "react";
import ErrorComponent from "@/components/common/ErrorComponent";
import PendingComponent from "@/components/common/PendingComponent";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";
import {
	useAdminDashboard,
	useAdminDashboardRevenueAnalytics,
	useAdminDashboardSessionOverview,
	useAdminDashboardUserGrowth,
} from "../hooks/queries/useAdminDashboard";
import type { AdminDashboardChartQuery } from "../types";
import { DualSeriesChart } from "../components/DualSeriesChart";
import { FilterControl } from "../components/FilterControl";
import { MetricCard } from "../components/MetricCard";
import { SessionOverviewPanel } from "../components/SessionOverviewPanel";
import { SingleSeriesChart } from "../components/SingleSeriesChart";
import { SystemHealthCard } from "../components/SystemHealthCard";
import { TopCategoriesCard } from "../components/TopCategoriesCard";
import { TopMentorsCard } from "../components/TopMentorsCard";
import { TrendIndicator } from "../components/TrendIndicator";
import {
	currency,
	getComparisonLabel,
	getDateRangeError,
	numberFormatter,
} from "../utils";

export function AdminDashboardPage() {
	const dashboardQuery = useAdminDashboard();
	const sessionOverviewQuery = useAdminDashboardSessionOverview();

	const [userGrowthFilter, setUserGrowthFilter] =
		useState<AdminDashboardChartQuery>({
			period: "month",
		});
	const [userGrowthDraft, setUserGrowthDraft] = useState({
		startDate: "",
		endDate: "",
	});

	const [revenueFilter, setRevenueFilter] = useState<AdminDashboardChartQuery>({
		period: "month",
	});
	const [revenueDraft, setRevenueDraft] = useState({
		startDate: "",
		endDate: "",
	});

	const userGrowthDateError = getDateRangeError(
		userGrowthDraft.startDate,
		userGrowthDraft.endDate,
	);
	const revenueDateError = getDateRangeError(
		revenueDraft.startDate,
		revenueDraft.endDate,
	);
	const userGrowthComparisonLabel = getComparisonLabel(
		userGrowthFilter.period,
		userGrowthFilter.startDate,
		userGrowthFilter.endDate,
	);
	const revenueComparisonLabel = getComparisonLabel(
		revenueFilter.period,
		revenueFilter.startDate,
		revenueFilter.endDate,
	);

	const userGrowthQuery = useAdminDashboardUserGrowth(
		userGrowthFilter,
		userGrowthFilter.period !== "custom" ||
			Boolean(userGrowthFilter.startDate && userGrowthFilter.endDate),
	);
	const revenueAnalyticsQuery = useAdminDashboardRevenueAnalytics(
		revenueFilter,
		revenueFilter.period !== "custom" ||
			Boolean(revenueFilter.startDate && revenueFilter.endDate),
	);

	const dashboard = dashboardQuery.data;

	const userGrowth = userGrowthQuery.data;
	const revenueAnalytics = revenueAnalyticsQuery.data;
	const sessionOverview = sessionOverviewQuery.data;

	const metricCards = useMemo(() => {
		if (!dashboard || !revenueAnalytics) {
			return [];
		}

		const sessionTrend = [
			dashboard.metrics.totalSessions.previous,
			dashboard.metrics.totalSessions.current,
			dashboard.metrics.totalSessions.total,
		];
		return [
			{
				title: "Total Sessions",
				value: numberFormatter.format(dashboard.metrics.totalSessions.total),
				changePercent: dashboard.metrics.totalSessions.changePercent,
				subtitle: "Completed, upcoming and cancelled",
				icon: CalendarDays,
				sparkline: sessionTrend,
				chartColor: "#22c55e",
			},
			{
				title: "Total Revenue",
				value: currency.format(dashboard.metrics.totalRevenue.total),
				changePercent: dashboard.metrics.totalRevenue.changePercent,
				subtitle: "Historical revenue analytics",
				icon: CircleDollarSign,
				sparkline: revenueAnalytics.series.map((item) => item.value),
				chartColor: "#f59e0b",
			},
		];
	}, [dashboard, revenueAnalytics]);

	if (dashboardQuery.isLoading && !dashboard) {
		return <PendingComponent resource="admin dashboard" />;
	}

	if (dashboardQuery.isError || !dashboard) {
		return (
			<ErrorComponent
				error={
					dashboardQuery.error instanceof Error
						? dashboardQuery.error
						: new Error("Failed to load admin dashboard")
				}
			/>
		);
	}

	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.08),transparent_28%),var(--background)] px-3 py-4 text-foreground sm:px-5 lg:px-6">
			<div className="mx-auto max-w-7xl space-y-3.5">
				<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
						<p className="mt-1 text-sm text-muted-foreground">
							Operational metrics, revenue signals, and backend health in one
							view.
						</p>
					</div>
				</div>

				<div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-2">
					{metricCards.map((card) => (
						<MetricCard key={card.title} {...card} />
					))}
				</div>

				<div className="space-y-3.5">
					<Card className="gap-0 border-border/70 bg-card/95 shadow-sm">
						<CardHeader className="flex flex-col gap-3 px-4 pt-4 md:flex-row md:items-start md:justify-between">
							<div>
								<CardTitle className="text-lg">User Growth</CardTitle>
								<CardDescription>Users and mentors over time</CardDescription>
							</div>
							<FilterControl
								value={userGrowthFilter.period}
								onChange={(value) => {
									setUserGrowthFilter(
										value === "custom" ? { period: value } : { period: value },
									);
								}}
								startDate={userGrowthDraft.startDate}
								endDate={userGrowthDraft.endDate}
								onStartDateChange={(value) =>
									setUserGrowthDraft((current) => ({
										...current,
										startDate: value,
									}))
								}
								onEndDateChange={(value) =>
									setUserGrowthDraft((current) => ({
										...current,
										endDate: value,
									}))
								}
								onApply={() =>
									setUserGrowthFilter({
										period: "custom",
										startDate: userGrowthDraft.startDate,
										endDate: userGrowthDraft.endDate,
									})
								}
								disabled={
									!userGrowthDraft.startDate ||
									!userGrowthDraft.endDate ||
									Boolean(userGrowthDateError)
								}
								error={userGrowthDateError}
							/>
						</CardHeader>
						<CardContent className="px-4 pb-4">
							{userGrowth ? <DualSeriesChart data={userGrowth} /> : null}
							<div className="mt-3 grid gap-2.5 sm:grid-cols-2">
								<div className="rounded-2xl border border-border/70 bg-background/60 p-3">
									<p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
										Users
									</p>
									<p className="mt-1 text-2xl font-semibold">
										{numberFormatter.format(dashboard.metrics.totalUsers.total)}
									</p>
									<TrendIndicator
										value={dashboard.metrics.totalUsers.changePercent}
										label={userGrowthComparisonLabel}
									/>
								</div>
								<div className="rounded-2xl border border-border/70 bg-background/60 p-3">
									<p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
										Mentors
									</p>
									<p className="mt-1 text-2xl font-semibold">
										{numberFormatter.format(
											dashboard.metrics.totalMentors.total,
										)}
									</p>
									<TrendIndicator
										value={dashboard.metrics.totalMentors.changePercent}
										label={userGrowthComparisonLabel}
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{sessionOverview ? (
						<SessionOverviewPanel overview={sessionOverview} />
					) : null}

					<Card className="gap-0 border-border/70 bg-card/95 shadow-sm">
						<CardHeader className="flex flex-col gap-3 px-4 pt-4 md:flex-row md:items-start md:justify-between">
							<div>
								<CardTitle className="text-lg">Revenue Analytics</CardTitle>
								<CardDescription>
									Effective platform revenue over time
								</CardDescription>
							</div>
							<FilterControl
								value={revenueFilter.period}
								onChange={(value) => {
									setRevenueFilter(
										value === "custom" ? { period: value } : { period: value },
									);
								}}
								startDate={revenueDraft.startDate}
								endDate={revenueDraft.endDate}
								onStartDateChange={(value) =>
									setRevenueDraft((current) => ({
										...current,
										startDate: value,
									}))
								}
								onEndDateChange={(value) =>
									setRevenueDraft((current) => ({ ...current, endDate: value }))
								}
								onApply={() =>
									setRevenueFilter({
										period: "custom",
										startDate: revenueDraft.startDate,
										endDate: revenueDraft.endDate,
									})
								}
								disabled={
									!revenueDraft.startDate ||
									!revenueDraft.endDate ||
									Boolean(revenueDateError)
								}
								error={revenueDateError}
							/>
						</CardHeader>
						<CardContent className="px-4 pb-4">
							{revenueAnalytics ? (
								<SingleSeriesChart
									labels={revenueAnalytics.labels}
									values={revenueAnalytics.series.map((item) => item.value)}
									color="#f59e0b"
								/>
							) : null}
							{revenueAnalytics ? (
								<div className="mt-3 grid gap-2.5 sm:grid-cols-3">
									<div className="rounded-2xl border border-border/70 bg-background/60 p-3">
										<p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
											Effective Revenue
										</p>
										<p className="mt-1 text-xl font-semibold">
											{currency.format(
												revenueAnalytics.breakdown.effectiveRevenue,
											)}
										</p>
										<p className="mt-1 text-xs text-muted-foreground">
											{revenueComparisonLabel}
										</p>
									</div>
									<div className="rounded-2xl border border-border/70 bg-background/60 p-3">
										<p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
											Platform Wallet Balance
										</p>
										<p className="mt-1 text-xl font-semibold">
											{currency.format(
												revenueAnalytics.breakdown.platformWalletBalance,
											)}
										</p>
										<p className="mt-1 text-xs text-muted-foreground">
											{revenueComparisonLabel}
										</p>
									</div>
									<div className="rounded-2xl border border-border/70 bg-background/60 p-3">
										<p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
											Upcoming Session Liability
										</p>
										<p className="mt-1 text-xl font-semibold">
											{currency.format(
												revenueAnalytics.breakdown.upcomingSessionLiability,
											)}
										</p>
										<p className="mt-1 text-xs text-muted-foreground">
											{revenueComparisonLabel}
										</p>
									</div>
								</div>
							) : null}
						</CardContent>
					</Card>
				</div>

				<div className="grid gap-3 xl:grid-cols-3">
					<TopMentorsCard mentors={dashboard.topMentors} />
					<TopCategoriesCard categories={dashboard.topCategories} />
					<SystemHealthCard systemHealth={dashboard.systemHealth} />
				</div>
			</div>
		</div>
	);
}

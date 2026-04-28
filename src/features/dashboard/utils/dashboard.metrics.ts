import type { LucideIcon } from "lucide-react";
import {
	Activity,
	CalendarDays,
	CheckCircle2,
	Clock3,
	FileText,
	Star,
	Users,
	Wallet,
} from "lucide-react";
import type { DashboardRole, DashboardSummary } from "../types";
import type { DASHBOARD_TONE_CLASSES } from "./dashboard.constants";
import {
	formatNumber,
	formatUnitAmount,
	growthLabel,
} from "./dashboard.formatters";

export interface DashboardMetricCardViewModel {
	title: string;
	value: string;
	subtitle: string;
	icon: LucideIcon;
	tone: keyof typeof DASHBOARD_TONE_CLASSES;
}

export function buildDashboardMetricCards(
	dashboard: DashboardSummary | null,
	dashboardRole: DashboardRole,
): DashboardMetricCardViewModel[] {
	if (!dashboard) return [];

	if (dashboardRole !== "MENTOR") {
		return [
			{
				title: "Upcoming Sessions",
				value: dashboard.upcomingSessionsCount.toString(),
				subtitle: "You have upcoming sessions",
				icon: CalendarDays,
				tone: "blue",
			},
			{
				title: "Completed Sessions",
				value: dashboard.completedSessionCount.toString(),
				subtitle: growthLabel(dashboard.sessionGrowth),
				icon: CheckCircle2,
				tone: "emerald",
			},
			{
				title: "Hours Learned",
				value: formatNumber(dashboard.hoursLearned, 1),
				subtitle: growthLabel(dashboard.hoursLearnedGrowth),
				icon: Clock3,
				tone: "violet",
			},
			{
				title: "Articles Read",
				value: (dashboard.articlesRead ?? 0).toString(),
				subtitle: "From article views",
				icon: FileText,
				tone: "amber",
			},
		];
	}

	return [
		{
			title: "Credited Earnings",
			value: formatUnitAmount(
				dashboard.netEarnings ?? dashboard.totalRevenue ?? 0,
				dashboard.earningsCurrency ?? "COINS",
			),
			subtitle: "After platform fee",
			icon: Wallet,
			tone: "violet",
		},
		{
			title: "Sessions Attended",
			value: (dashboard.totalSessionsAttended ?? 0).toString(),
			subtitle: growthLabel(dashboard.sessionGrowth),
			icon: CalendarDays,
			tone: "blue",
		},
		{
			title: "Average Rating",
			value: formatNumber(dashboard.averageRating ?? 4.8, 1),
			subtitle: "Dummy for now",
			icon: Star,
			tone: "amber",
		},
		{
			title: "Total Mentees",
			value: (dashboard.totalMentees ?? 0).toString(),
			subtitle: "Unique learners",
			icon: Users,
			tone: "emerald",
		},
		{
			title: "Total Avg Rating",
			value: formatNumber(dashboard.totalAverageRating ?? 4.8, 1),
			subtitle: "From mentor profile",
			icon: Activity,
			tone: "rose",
		},
	];
}

import {
	keepPreviousData,
	queryOptions,
	useQuery,
} from "@tanstack/react-query";
import { dashboardService } from "../../services/dashboard.service";
import type { DashboardPeriod, DashboardRole } from "../../types";

export const dashboardQueryOptions = (role: DashboardRole) =>
	queryOptions({
		queryKey: ["dashboard", role],
		queryFn: () => dashboardService.getDashboard(),
		staleTime: 1000 * 60,
	});

export const dashboardActivityOverviewQueryOptions = (
	role: DashboardRole,
	period: DashboardPeriod,
) =>
	queryOptions({
		queryKey: ["dashboard", "activity-overview", role, period],
		queryFn: () => dashboardService.getActivityOverview(period),
		staleTime: 1000 * 60,
	});

export const useDashboardQuery = (role: DashboardRole) =>
	useQuery(dashboardQueryOptions(role));

export const useDashboardActivityOverviewQuery = (
	role: DashboardRole,
	period: DashboardPeriod,
) =>
	useQuery({
		...dashboardActivityOverviewQueryOptions(role, period),
		placeholderData: keepPreviousData,
	});

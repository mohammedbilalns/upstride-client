import {
	keepPreviousData,
	queryOptions,
	useQuery,
} from "@tanstack/react-query";
import { adminDashboardService } from "../../services/admin-dashboard.service";
import type { AdminDashboardChartQuery } from "../../types";

export const adminDashboardQueryOptions = queryOptions({
	queryKey: ["admin-dashboard"],
	queryFn: () => adminDashboardService.getDashboard(),
	staleTime: 1000 * 60,
});

export const adminDashboardUserGrowthQueryOptions = (
	params: AdminDashboardChartQuery,
) =>
	queryOptions({
		queryKey: ["admin-dashboard", "user-growth", params],
		queryFn: () => adminDashboardService.getUserGrowth(params),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60,
	});

export const adminDashboardRevenueAnalyticsQueryOptions = (
	params: AdminDashboardChartQuery,
) =>
	queryOptions({
		queryKey: ["admin-dashboard", "revenue-analytics", params],
		queryFn: () => adminDashboardService.getRevenueAnalytics(params),
		placeholderData: keepPreviousData,
		staleTime: 1000 * 60,
	});

export const adminDashboardSessionOverviewQueryOptions = queryOptions({
	queryKey: ["admin-dashboard", "session-overview"],
	queryFn: () => adminDashboardService.getSessionOverview(),
	staleTime: 1000 * 60,
});

export const useAdminDashboard = () => useQuery(adminDashboardQueryOptions);

export const useAdminDashboardUserGrowth = (
	params: AdminDashboardChartQuery,
	enabled = true,
) =>
	useQuery({
		...adminDashboardUserGrowthQueryOptions(params),
		enabled,
	});

export const useAdminDashboardRevenueAnalytics = (
	params: AdminDashboardChartQuery,
	enabled = true,
) =>
	useQuery({
		...adminDashboardRevenueAnalyticsQueryOptions(params),
		enabled,
	});

export const useAdminDashboardSessionOverview = () =>
	useQuery(adminDashboardSessionOverviewQueryOptions);

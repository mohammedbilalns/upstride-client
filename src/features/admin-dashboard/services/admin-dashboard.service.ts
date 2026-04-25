import type { ApiSuccess } from "@/api/apiSuccess";
import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	AdminDashboardChartQuery,
	AdminDashboardResponse,
	AdminDashboardRevenueAnalyticsResponse,
	AdminDashboardSessionOverviewResponse,
	AdminDashboardUserGrowthResponse,
} from "../types";

export const adminDashboardService = {
	getDashboard: async () => {
		const response = await api.get<ApiSuccess<AdminDashboardResponse>>(
			`${ROUTES.ADMIN_DASHBOARD.BASE}${ROUTES.ADMIN_DASHBOARD.ROOT}`,
		);
		return response.data.data;
	},

	getUserGrowth: async (params: AdminDashboardChartQuery) => {
		const response = await api.get<
			ApiSuccess<AdminDashboardUserGrowthResponse>
		>(`${ROUTES.ADMIN_DASHBOARD.BASE}${ROUTES.ADMIN_DASHBOARD.USER_GROWTH}`, {
			params,
		});
		return response.data.data;
	},

	getRevenueAnalytics: async (params: AdminDashboardChartQuery) => {
		const response = await api.get<
			ApiSuccess<AdminDashboardRevenueAnalyticsResponse>
		>(
			`${ROUTES.ADMIN_DASHBOARD.BASE}${ROUTES.ADMIN_DASHBOARD.REVENUE_ANALYTICS}`,
			{ params },
		);
		return response.data.data;
	},

	getSessionOverview: async () => {
		const response = await api.get<
			ApiSuccess<AdminDashboardSessionOverviewResponse>
		>(
			`${ROUTES.ADMIN_DASHBOARD.BASE}${ROUTES.ADMIN_DASHBOARD.SESSION_OVERVIEW}`,
		);
		return response.data.data;
	},
};

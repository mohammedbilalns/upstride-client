import type { ApiSuccess } from "@/api/apiSuccess";
import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	DashboardActivityOverview,
	DashboardPeriod,
	DashboardSummary,
} from "../types";

export const dashboardService = {
	getDashboard: async () => {
		const response = await api.get<ApiSuccess<DashboardSummary>>(
			ROUTES.DASHBOARD.BASE,
		);
		return response.data.data;
	},

	getActivityOverview: async (period: DashboardPeriod) => {
		const response = await api.get<ApiSuccess<DashboardActivityOverview>>(
			`${ROUTES.DASHBOARD.BASE}${ROUTES.DASHBOARD.ACTIVITY_OVERVIEW}`,
			{ params: { period } },
		);
		return response.data.data;
	},
};

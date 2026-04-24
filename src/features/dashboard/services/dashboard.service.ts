import type { ApiSuccess } from "@/api/apiSuccess";
import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	DashboardActivityOverviewDto,
	DashboardPeriod,
	DashboardSummaryDto,
} from "../types";

export const dashboardService = {
	getDashboard: async () => {
		const response = await api.get<ApiSuccess<DashboardSummaryDto>>(
			ROUTES.DASHBOARD.BASE,
		);
		return response.data.data;
	},

	getActivityOverview: async (period: DashboardPeriod) => {
		const response = await api.get<ApiSuccess<DashboardActivityOverviewDto>>(
			`${ROUTES.DASHBOARD.BASE}${ROUTES.DASHBOARD.ACTIVITY_OVERVIEW}`,
			{ params: { period } },
		);
		return response.data.data;
	},
};

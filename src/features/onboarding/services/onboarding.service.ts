import type { ApiSuccess } from "@/api/apiSuccess";
import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type { GetOnboardingCatalogResponse } from "../types";

export const onboardingService = {
	getOnboardingCatalog: async () => {
		const response = await api.get<ApiSuccess<GetOnboardingCatalogResponse>>(
			`${ROUTES.CATALOG.BASE}${ROUTES.CATALOG.ONBOARDING}`,
		);
		return response.data;
	},
};

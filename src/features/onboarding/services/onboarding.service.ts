import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type { GetOnboardingCatalogResponse } from "../types";

export const onboardingService = {
	getOnboardingCatalog: async (): Promise<{
		message: string;
		data: GetOnboardingCatalogResponse;
	}> => {
		const response = await api.get<{
			message: string;
			data: GetOnboardingCatalogResponse;
		}>(`${ROUTES.CATALOG.BASE}${ROUTES.CATALOG.ONBOARDING}`);
		return response.data;
	},
};

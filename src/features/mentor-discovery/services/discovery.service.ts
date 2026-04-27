import type { ApiSuccess } from "@/api/apiSuccess";
import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	GetCategoriesResponse,
	GetMentorsDiscoveryInput,
	GetMentorsDiscoveryResponse,
} from "../types";

export const mentorDiscoveryService = {
	getMentors: async (params: GetMentorsDiscoveryInput) => {
		const response = await api.get<ApiSuccess<GetMentorsDiscoveryResponse>>(
			`${ROUTES.MENTOR.BASE}${ROUTES.MENTOR.DISCOVERY}`,
			{ params },
		);
		return response.data.data;
	},
	getCategories: async () => {
		const response = await api.get<ApiSuccess<GetCategoriesResponse>>(
			`${ROUTES.CATALOG.BASE}${ROUTES.CATALOG.ONBOARDING}`,
		);
		return response.data.data.interests;
	},
};

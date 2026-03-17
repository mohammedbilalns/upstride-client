import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type { CatalogInterest } from "@/features/onboarding/types";
import type {
	GetMentorsDiscoveryInput,
	GetMentorsDiscoveryResponse,
} from "../types";

export const mentorDiscoveryService = {
	getMentors: async (
		params: GetMentorsDiscoveryInput,
	): Promise<GetMentorsDiscoveryResponse> => {
		const response = await api.get<{ data: GetMentorsDiscoveryResponse }>(
			`${ROUTES.MENTOR.BASE}${ROUTES.MENTOR.DISCOVERY}`,
			{ params },
		);
		return response.data.data;
	},
	getCategories: async (): Promise<CatalogInterest[]> => {
		const response = await api.get<{
			message: string;
			data: { interests: CatalogInterest[] };
		}>(`${ROUTES.CATALOG.BASE}${ROUTES.CATALOG.ONBOARDING}`);
		return response.data.data.interests;
	},
};

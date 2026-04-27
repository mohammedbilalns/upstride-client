import type { ApiSuccess } from "@/api/apiSuccess";
import api from "@/api/axios";
import { ROUTES } from "@/api/routes";

export interface Profession {
	id: string;
	name: string;
	slug: string;
}
export type GetProfessionsResponse = Profession[];

export const catalogService = {
	getProfessions: async (): Promise<{
		message: string;
		data: Profession[];
	}> => {
		const response = await api.get<ApiSuccess<GetProfessionsResponse>>(
			`${ROUTES.CATALOG.BASE}${ROUTES.CATALOG.PROFESSIONS}`,
		);
		return response.data;
	},
};

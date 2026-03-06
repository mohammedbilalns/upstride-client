import api from "@/api/axios";
import { ROUTES } from "@/api/routes";

export interface Profession {
	id: string;
	name: string;
	slug: string;
}

export const catalogService = {
	getProfessions: async (): Promise<{
		message: string;
		data: Profession[];
	}> => {
		const response = await api.get<{
			message: string;
			data: Profession[];
		}>(`${ROUTES.CATALOG.BASE}${ROUTES.CATALOG.PROFESSIONS}`);
		return response.data;
	},
};

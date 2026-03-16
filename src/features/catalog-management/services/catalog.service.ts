import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	AddInterestInput,
	AddProfessionInput,
	AddSkillInput,
	CatalogActionResponse,
	FetchCatalogResponse,
	GetOnboardingCatalogResponse,
	GetProfessionsResponse,
} from "../types";

export const catalogService = {
	fetchCatalog: async (): Promise<FetchCatalogResponse> => {
		const response = await api.get<FetchCatalogResponse>(
			`${ROUTES.CATALOG.BASE}${ROUTES.CATALOG.FETCH}`,
		);
		return response.data;
	},

	getOnboardingCatalog: async (): Promise<GetOnboardingCatalogResponse> => {
		const response = await api.get<GetOnboardingCatalogResponse>(
			`${ROUTES.CATALOG.BASE}${ROUTES.CATALOG.ONBOARDING}`,
		);
		return response.data;
	},

	getProfessions: async (): Promise<GetProfessionsResponse> => {
		const response = await api.get<GetProfessionsResponse>(
			`${ROUTES.CATALOG.BASE}${ROUTES.CATALOG.PROFESSIONS}`,
		);
		return response.data;
	},

	addInterest: async (
		data: AddInterestInput,
	): Promise<CatalogActionResponse> => {
		const response = await api.post<CatalogActionResponse>(
			`${ROUTES.CATALOG.BASE}${ROUTES.CATALOG.ADD_INTEREST}`,
			data,
		);
		return response.data;
	},

	disableInterest: async (id: string): Promise<CatalogActionResponse> => {
		const response = await api.patch<CatalogActionResponse>(
			`${ROUTES.CATALOG.BASE}${ROUTES.CATALOG.DISABLE_INTEREST(id)}`,
		);
		return response.data;
	},

	addSkill: async (data: AddSkillInput): Promise<CatalogActionResponse> => {
		const response = await api.post<CatalogActionResponse>(
			`${ROUTES.CATALOG.BASE}${ROUTES.CATALOG.ADD_SKILL}`,
			data,
		);
		return response.data;
	},

	disableSkill: async (id: string): Promise<CatalogActionResponse> => {
		const response = await api.patch<CatalogActionResponse>(
			`${ROUTES.CATALOG.BASE}${ROUTES.CATALOG.DISABLE_SKILL(id)}`,
		);
		return response.data;
	},

	addProfession: async (
		data: AddProfessionInput,
	): Promise<CatalogActionResponse> => {
		const response = await api.post<CatalogActionResponse>(
			`${ROUTES.CATALOG.BASE}${ROUTES.CATALOG.ADD_PROFESSION}`,
			data,
		);
		return response.data;
	},

	disableProfession: async (id: string): Promise<CatalogActionResponse> => {
		const response = await api.patch<CatalogActionResponse>(
			`${ROUTES.CATALOG.BASE}${ROUTES.CATALOG.DISABLE_PROFESSION(id)}`,
		);
		return response.data;
	},

	enableInterest: async (id: string): Promise<CatalogActionResponse> => {
		const response = await api.patch<CatalogActionResponse>(
			`${ROUTES.CATALOG.BASE}${ROUTES.CATALOG.ENABLE_INTEREST(id)}`,
		);
		return response.data;
	},

	enableSkill: async (id: string): Promise<CatalogActionResponse> => {
		const response = await api.patch<CatalogActionResponse>(
			`${ROUTES.CATALOG.BASE}${ROUTES.CATALOG.ENABLE_SKILL(id)}`,
		);
		return response.data;
	},

	enableProfession: async (id: string): Promise<CatalogActionResponse> => {
		const response = await api.patch<CatalogActionResponse>(
			`${ROUTES.CATALOG.BASE}${ROUTES.CATALOG.ENABLE_PROFESSION(id)}`,
		);
		return response.data;
	},
};

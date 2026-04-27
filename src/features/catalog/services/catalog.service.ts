import type { ApiSuccess } from "@/api/apiSuccess";
import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	AddInterestInput,
	AddInterestResponse,
	AddProfessionInput,
	AddProfessionResponse,
	AddSkillInput,
	AddSkillIResponse,
	CatalogIsActiveMutationResponse,
	FetchCatalogResponse,
	GetOnboardingCatalogResponse,
	GetProfessionsResponse,
	UpdateCatalogInput,
} from "../types";

export const catalogService = {
	fetchCatalog: async () => {
		const response = await api.get<ApiSuccess<FetchCatalogResponse>>(
			`${ROUTES.CATALOG.BASE}${ROUTES.CATALOG.FETCH}`,
		);
		return response.data;
	},

	getOnboardingCatalog: async () => {
		const response = await api.get<ApiSuccess<GetOnboardingCatalogResponse>>(
			`${ROUTES.CATALOG.BASE}${ROUTES.CATALOG.ONBOARDING}`,
		);
		return response.data;
	},

	getProfessions: async () => {
		const response = await api.get<ApiSuccess<GetProfessionsResponse>>(
			`${ROUTES.CATALOG.BASE}${ROUTES.CATALOG.PROFESSIONS}`,
		);
		return response.data;
	},

	addInterest: async (data: AddInterestInput) => {
		const response = await api.post<ApiSuccess<AddInterestResponse>>(
			`${ROUTES.CATALOG.BASE}${ROUTES.CATALOG.ADD_INTEREST}`,
			data,
		);
		return response.data;
	},

	disableInterest: async (id: string) => {
		const response = await api.patch<
			ApiSuccess<CatalogIsActiveMutationResponse>
		>(`${ROUTES.CATALOG.BASE}${ROUTES.CATALOG.DISABLE_INTEREST(id)}`);
		return response.data;
	},

	addSkill: async (data: AddSkillInput) => {
		const response = await api.post<ApiSuccess<AddSkillIResponse>>(
			`${ROUTES.CATALOG.BASE}${ROUTES.CATALOG.ADD_SKILL}`,
			data,
		);
		return response.data;
	},

	disableSkill: async (id: string) => {
		const response = await api.patch<
			ApiSuccess<CatalogIsActiveMutationResponse>
		>(`${ROUTES.CATALOG.BASE}${ROUTES.CATALOG.DISABLE_SKILL(id)}`);
		return response.data;
	},

	addProfession: async (data: AddProfessionInput) => {
		const response = await api.post<ApiSuccess<AddProfessionResponse>>(
			`${ROUTES.CATALOG.BASE}${ROUTES.CATALOG.ADD_PROFESSION}`,
			data,
		);
		return response.data;
	},

	disableProfession: async (id: string) => {
		const response = await api.patch<
			ApiSuccess<CatalogIsActiveMutationResponse>
		>(`${ROUTES.CATALOG.BASE}${ROUTES.CATALOG.DISABLE_PROFESSION(id)}`);
		return response.data;
	},

	enableInterest: async (id: string) => {
		const response = await api.patch<
			ApiSuccess<CatalogIsActiveMutationResponse>
		>(`${ROUTES.CATALOG.BASE}${ROUTES.CATALOG.ENABLE_INTEREST(id)}`);
		return response.data;
	},

	enableSkill: async (id: string) => {
		const response = await api.patch<
			ApiSuccess<CatalogIsActiveMutationResponse>
		>(`${ROUTES.CATALOG.BASE}${ROUTES.CATALOG.ENABLE_SKILL(id)}`);
		return response.data;
	},

	enableProfession: async (id: string) => {
		const response = await api.patch<
			ApiSuccess<CatalogIsActiveMutationResponse>
		>(`${ROUTES.CATALOG.BASE}${ROUTES.CATALOG.ENABLE_PROFESSION(id)}`);
		return response.data;
	},

	updateInterest: async (id: string, data: UpdateCatalogInput) => {
		const response = await api.patch<ApiSuccess>(
			`${ROUTES.CATALOG.BASE}${ROUTES.CATALOG.UPDATE_INTEREST(id)}`,
			data,
		);
		return response.data;
	},
	updateSkill: async (id: string, data: UpdateCatalogInput) => {
		const response = await api.patch<ApiSuccess>(
			`${ROUTES.CATALOG.BASE}${ROUTES.CATALOG.UPDATE_SKILL(id)}`,
			data,
		);
		return response.data;
	},
	updateProfession: async (id: string, data: UpdateCatalogInput) => {
		const response = await api.patch<ApiSuccess>(
			`${ROUTES.CATALOG.BASE}${ROUTES.CATALOG.UPDATE_PROFESSION(id)}`,
			data,
		);
		return response.data;
	},
};

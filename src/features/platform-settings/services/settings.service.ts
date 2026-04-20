import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	FetchPlatformSettingsResponse,
	UpdateContentSettingsInput,
	UpdateContentSettingsResponse,
	UpdateEconomySettingsInput,
	UpdateEconomySettingsResponse,
	UpdateMentorSettingsInput,
	UpdateMentorSettingsResponse,
	UpdateSessionSettingsInput,
	UpdateSessionSettingsResponse,
} from "../types";

export const platformSettingsService = {
	fetchAll: async (): Promise<FetchPlatformSettingsResponse> => {
		const response = await api.get<FetchPlatformSettingsResponse>(
			`${ROUTES.PLATFORM_SETTINGS.BASE}${ROUTES.PLATFORM_SETTINGS.FETCH}`,
		);
		return response.data;
	},

	updateEconomy: async (
		data: UpdateEconomySettingsInput,
	): Promise<UpdateEconomySettingsResponse> => {
		const response = await api.patch<UpdateEconomySettingsResponse>(
			`${ROUTES.PLATFORM_SETTINGS.BASE}${ROUTES.PLATFORM_SETTINGS.ECONOMY}`,
			data,
		);
		return response.data;
	},

	updateMentors: async (
		data: UpdateMentorSettingsInput,
	): Promise<UpdateMentorSettingsResponse> => {
		const response = await api.patch<UpdateMentorSettingsResponse>(
			`${ROUTES.PLATFORM_SETTINGS.BASE}${ROUTES.PLATFORM_SETTINGS.MENTORS}`,
			data,
		);
		return response.data;
	},

	updateContent: async (
		data: UpdateContentSettingsInput,
	): Promise<UpdateContentSettingsResponse> => {
		const response = await api.patch<UpdateContentSettingsResponse>(
			`${ROUTES.PLATFORM_SETTINGS.BASE}${ROUTES.PLATFORM_SETTINGS.CONTENT}`,
			data,
		);
		return response.data;
	},

	updateSessions: async (
		data: UpdateSessionSettingsInput,
	): Promise<UpdateSessionSettingsResponse> => {
		const response = await api.patch<UpdateSessionSettingsResponse>(
			`${ROUTES.PLATFORM_SETTINGS.BASE}${ROUTES.PLATFORM_SETTINGS.SESSIONS}`,
			data,
		);
		return response.data;
	},
};

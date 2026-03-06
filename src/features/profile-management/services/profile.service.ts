import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	GetProfileOutput,
	UpdateProfileInput,
	UpdateProfileOutput,
} from "../types";

export const profileService = {
	getProfile: async (): Promise<GetProfileOutput> => {
		const response = await api.get<GetProfileOutput>(
			`${ROUTES.AUTH.BASE}${ROUTES.AUTH.PROFILE}`,
		);
		return response.data;
	},
	updateProfile: async (
		data: UpdateProfileInput,
	): Promise<UpdateProfileOutput> => {
		const response = await api.put<UpdateProfileOutput>(
			`${ROUTES.AUTH.BASE}${ROUTES.AUTH.PROFILE}`,
			data,
		);
		return response.data;
	},
};

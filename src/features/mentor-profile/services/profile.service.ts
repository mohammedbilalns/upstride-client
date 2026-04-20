import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	MentorProfileResponse,
	UpdateMentorProfileInput,
	UpdateMentorProfileResponse,
} from "../types";

export const mentorProfileService = {
	getProfile: async (): Promise<MentorProfileResponse> => {
		const response = await api.get<MentorProfileResponse>(
			`${ROUTES.MENTOR.BASE}${ROUTES.MENTOR.PROFILE}`,
		);
		return response.data;
	},
	updateProfile: async (
		data: UpdateMentorProfileInput,
	): Promise<UpdateMentorProfileResponse> => {
		const response = await api.patch<UpdateMentorProfileResponse>(
			`${ROUTES.MENTOR.BASE}${ROUTES.MENTOR.PROFILE}`,
			data,
		);
		return response.data;
	},
};

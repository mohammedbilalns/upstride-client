import type { ApiSuccess } from "@/api/apiSuccess";
import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	MentorProfileResponse,
	UpdateMentorProfileInput,
	UpdateMentorProfileResponse,
} from "../types";

export const mentorProfileService = {
	getProfile: async () => {
		const response = await api.get<ApiSuccess<MentorProfileResponse>>(
			`${ROUTES.MENTOR.BASE}${ROUTES.MENTOR.PROFILE}`,
		);
		return response.data;
	},
	updateProfile: async (data: UpdateMentorProfileInput) => {
		const response = await api.patch<ApiSuccess<UpdateMentorProfileResponse>>(
			`${ROUTES.MENTOR.BASE}${ROUTES.MENTOR.PROFILE}`,
			data,
		);
		return response.data;
	},
};

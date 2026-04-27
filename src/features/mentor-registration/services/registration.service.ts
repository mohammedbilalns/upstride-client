import type { ApiSuccess } from "@/api/apiSuccess";
import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type { MentorRegistrationValues } from "@/features/mentor-registration/validators/mentor-registration.schema";
import type { MentorRegistrationInfoResponse } from "../types";

export const mentorRegistrationService = {
	getRegistrationInfo: async () => {
		const response = await api.get<ApiSuccess<MentorRegistrationInfoResponse>>(
			`${ROUTES.MENTOR.BASE}${ROUTES.MENTOR.REGISTRATION_INFO}`,
		);
		return response.data;
	},

	register: async (data: MentorRegistrationValues) => {
		const response = await api.post<ApiSuccess>(
			`${ROUTES.MENTOR.BASE}${ROUTES.MENTOR.REGISTER}`,
			data,
		);
		return response.data;
	},

	resubmit: async (data: Partial<MentorRegistrationValues>) => {
		const response = await api.patch<ApiSuccess>(
			`${ROUTES.MENTOR.BASE}${ROUTES.MENTOR.RESUBMIT}`,
			data,
		);
		return response.data;
	},
};

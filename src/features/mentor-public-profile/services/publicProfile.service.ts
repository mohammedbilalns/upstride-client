import type { ApiSuccess } from "@/api/apiSuccess";
import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type { PublicMentorAvailableSlotsResponse } from "../../availability/types";
import type { PublicMentorProfileResponse } from "../types";

export const publicMentorProfileService = {
	getPublicProfile: async (mentorId: string) => {
		const response = await api.get<ApiSuccess<PublicMentorProfileResponse>>(
			`${ROUTES.MENTOR.BASE}${ROUTES.MENTOR.PUBLIC_PROFILE(mentorId)}`,
		);
		return response.data;
	},

	getAvailableSlotsForDay: async (mentorId: string, date: string) => {
		const response = await api.get<
			ApiSuccess<PublicMentorAvailableSlotsResponse>
		>(`${ROUTES.BOOKINGS.BASE}${ROUTES.BOOKINGS.SLOTS(mentorId)}`, {
			params: { date },
		});
		return response.data;
	},
};

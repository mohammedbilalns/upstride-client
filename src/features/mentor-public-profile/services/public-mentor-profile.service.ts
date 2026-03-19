import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	PublicMentorAvailableSlotsResponse,
	PublicMentorProfileResponse,
} from "../types";

export const publicMentorProfileService = {
	getPublicProfile: async (
		mentorId: string,
	): Promise<PublicMentorProfileResponse> => {
		const response = await api.get<PublicMentorProfileResponse>(
			`${ROUTES.MENTOR.BASE}${ROUTES.MENTOR.PUBLIC_PROFILE(mentorId)}`,
		);
		return response.data;
	},

	getAvailableSlotsForDay: async (
		mentorId: string,
		date: string,
	): Promise<PublicMentorAvailableSlotsResponse> => {
		const response = await api.get<PublicMentorAvailableSlotsResponse>(
			`${ROUTES.SESSION_SLOTS.BASE}${ROUTES.SESSION_SLOTS.PUBLIC_AVAILABLE(
				mentorId,
			)}`,
			{ params: { date } },
		);
		return response.data;
	},
};

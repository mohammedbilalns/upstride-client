import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	GetMentorApplicationsInput,
	GetMentorApplicationsResponse,
	RejectMentorInput,
} from "@/shared/types/mentor";

export const MentorManagementService = {
	getApplications: async (
		params: GetMentorApplicationsInput,
	): Promise<GetMentorApplicationsResponse> => {
		const response = await api.get<{
			message: string;
			data: GetMentorApplicationsResponse;
		}>(`${ROUTES.MENTOR.BASE}${ROUTES.MENTOR.APPLICATIONS}`, { params });
		return response.data.data;
	},

	approveApplication: async (id: string): Promise<void> => {
		await api.patch(`${ROUTES.MENTOR.BASE}${ROUTES.MENTOR.APPROVE(id)}`);
	},

	rejectApplication: async (input: RejectMentorInput): Promise<void> => {
		const { mentorId, ...body } = input;
		await api.patch(
			`${ROUTES.MENTOR.BASE}${ROUTES.MENTOR.REJECT(mentorId)}`,
			body,
		);
	},
};

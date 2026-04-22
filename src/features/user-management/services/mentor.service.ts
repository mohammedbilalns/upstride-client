import type { ApiSuccess } from "@/api/apiSuccess";
import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	GetMentorApplicationsInput,
	GetMentorApplicationsResponse,
	RejectMentorInput,
} from "@/shared/types/mentor";

export const MentorManagementService = {
	getApplications: async (params: GetMentorApplicationsInput) => {
		const response = await api.get<ApiSuccess<GetMentorApplicationsResponse>>(
			`${ROUTES.MENTOR.BASE}${ROUTES.MENTOR.APPLICATIONS}`,
			{ params },
		);
		return response.data.data;
	},

	approveApplication: async (id: string) => {
		await api.patch<ApiSuccess>(
			`${ROUTES.MENTOR.BASE}${ROUTES.MENTOR.APPROVE(id)}`,
		);
	},

	rejectApplication: async (input: RejectMentorInput): Promise<void> => {
		const { mentorId, ...body } = input;
		await api.patch<ApiSuccess>(
			`${ROUTES.MENTOR.BASE}${ROUTES.MENTOR.REJECT(mentorId)}`,
			body,
		);
	},
};

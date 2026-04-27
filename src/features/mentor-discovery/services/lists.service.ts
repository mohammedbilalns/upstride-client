import type { ApiSuccess } from "@/api/apiSuccess";
import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	AddMentorToListInput,
	CreateMentorListInput,
	CreateMentorListResponse,
	DeleteMentorListInput,
	GetMentorListResponse,
	GetMentorListsResponse,
	RemoveMentorFromListInput,
} from "../types";

export const mentorListsService = {
	getLists: async () => {
		const response = await api.get<ApiSuccess<GetMentorListsResponse>>(
			`${ROUTES.MENTOR_LISTS.BASE}${ROUTES.MENTOR_LISTS.ROOT}`,
		);
		return response.data.data;
	},

	getList: async (listId: string) => {
		const response = await api.get<ApiSuccess<GetMentorListResponse>>(
			`${ROUTES.MENTOR_LISTS.BASE}${ROUTES.MENTOR_LISTS.BY_ID(listId)}`,
		);
		return response.data.data;
	},

	createList: async (input: CreateMentorListInput) => {
		const response = await api.post<ApiSuccess<CreateMentorListResponse>>(
			`${ROUTES.MENTOR_LISTS.BASE}${ROUTES.MENTOR_LISTS.ROOT}`,
			input,
		);
		return response.data.data;
	},

	addMentor: async (input: AddMentorToListInput) => {
		await api.post<ApiSuccess>(
			`${ROUTES.MENTOR_LISTS.BASE}${ROUTES.MENTOR_LISTS.ADD_MENTOR(input.listId)}`,
			{ mentorId: input.mentorId },
		);
	},

	removeMentor: async (input: RemoveMentorFromListInput) => {
		await api.delete<ApiSuccess>(
			`${ROUTES.MENTOR_LISTS.BASE}${ROUTES.MENTOR_LISTS.REMOVE_MENTOR(input.listId, input.mentorId)}`,
		);
	},

	deleteList: async (input: DeleteMentorListInput) => {
		await api.delete<ApiSuccess>(
			`${ROUTES.MENTOR_LISTS.BASE}${ROUTES.MENTOR_LISTS.BY_ID(input.listId)}`,
		);
	},
};

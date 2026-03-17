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
	getLists: async (): Promise<GetMentorListsResponse> => {
		const response = await api.get<{ data: GetMentorListsResponse }>(
			`${ROUTES.MENTOR_LISTS.BASE}${ROUTES.MENTOR_LISTS.ROOT}`,
		);
		return response.data.data;
	},

	getList: async (listId: string): Promise<GetMentorListResponse> => {
		const response = await api.get<{ data: GetMentorListResponse }>(
			`${ROUTES.MENTOR_LISTS.BASE}${ROUTES.MENTOR_LISTS.BY_ID(listId)}`,
		);
		return response.data.data;
	},

	createList: async (
		input: CreateMentorListInput,
	): Promise<CreateMentorListResponse> => {
		const response = await api.post<{ data: CreateMentorListResponse }>(
			`${ROUTES.MENTOR_LISTS.BASE}${ROUTES.MENTOR_LISTS.ROOT}`,
			input,
		);
		return response.data.data;
	},

	addMentor: async (input: AddMentorToListInput): Promise<void> => {
		await api.post(
			`${ROUTES.MENTOR_LISTS.BASE}${ROUTES.MENTOR_LISTS.ADD_MENTOR(input.listId)}`,
			{ mentorId: input.mentorId },
		);
	},

	removeMentor: async (input: RemoveMentorFromListInput): Promise<void> => {
		await api.delete(
			`${ROUTES.MENTOR_LISTS.BASE}${ROUTES.MENTOR_LISTS.REMOVE_MENTOR(input.listId, input.mentorId)}`,
		);
	},

	deleteList: async (input: DeleteMentorListInput): Promise<void> => {
		await api.delete(
			`${ROUTES.MENTOR_LISTS.BASE}${ROUTES.MENTOR_LISTS.BY_ID(input.listId)}`,
		);
	},
};

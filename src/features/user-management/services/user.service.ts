import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	BlockUserInput,
	GetUsersInput,
	GetUsersResponse,
	UnblockUserInput,
	UserStatusMutationResponse,
} from "../types";

export const UserManagementService = {
	getUsers: async (params: GetUsersInput): Promise<GetUsersResponse> => {
		const response = await api.get<{ message: string; data: GetUsersResponse }>(
			`${ROUTES.USER_MANAGEMENT.BASE}${ROUTES.USER_MANAGEMENT.FETCH_USERS}`,
			{ params },
		);
		return response.data.data;
	},

	blockUser: async (
		input: BlockUserInput,
	): Promise<UserStatusMutationResponse> => {
		const response = await api.patch<UserStatusMutationResponse>(
			`${ROUTES.USER_MANAGEMENT.BASE}${ROUTES.USER_MANAGEMENT.BLOCK(input.userId)}`,
		);
		return response.data;
	},

	unblockUser: async (
		input: UnblockUserInput,
	): Promise<UserStatusMutationResponse> => {
		const response = await api.patch<UserStatusMutationResponse>(
			`${ROUTES.USER_MANAGEMENT.BASE}${ROUTES.USER_MANAGEMENT.UNBLOCK(input.userId)}`,
		);
		return response.data;
	},
};

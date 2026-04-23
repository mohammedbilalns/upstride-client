import type { ApiSuccess } from "@/api/apiSuccess";
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
	getUsers: async (params: GetUsersInput) => {
		const response = await api.get<ApiSuccess<GetUsersResponse>>(
			`${ROUTES.USERS.BASE}${ROUTES.USERS.FETCH_USERS}`,
			{ params },
		);
		return response.data.data;
	},

	blockUser: async (input: BlockUserInput) => {
		const response = await api.patch<ApiSuccess<UserStatusMutationResponse>>(
			`${ROUTES.USERS.BASE}${ROUTES.USERS.BLOCK(input.userId)}`,
		);
		return response.data;
	},

	unblockUser: async (input: UnblockUserInput) => {
		const response = await api.patch<ApiSuccess<UserStatusMutationResponse>>(
			`${ROUTES.USERS.BASE}${ROUTES.USERS.UNBLOCK(input.userId)}`,
		);
		return response.data;
	},
};

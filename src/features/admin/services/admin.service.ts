import type { ApiSuccess } from "@/api/apiSuccess";
import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	BlockAdminInput,
	CreateAdminInput,
	CreateAdminResponse,
	GetAdminsInput,
	GetAdminsResponse,
	UnblockAdminInput,
} from "../types";

export const AdminManagementService = {
	getAdmins: async (params: GetAdminsInput) => {
		const response = await api.get<ApiSuccess<GetAdminsResponse>>(
			`${ROUTES.ADMINS.BASE}${ROUTES.ADMINS.FETCH_ADMINS}`,
			{
				params,
			},
		);
		return response.data.data;
	},

	createAdmin: async (input: CreateAdminInput) => {
		const response = await api.post<ApiSuccess<CreateAdminResponse>>(
			`${ROUTES.ADMINS.BASE}${ROUTES.ADMINS.CREATE_ADMIN}`,
			input,
		);

		return response.data;
	},

	blockAdmin: async (input: BlockAdminInput): Promise<ApiSuccess> => {
		const response = await api.patch(
			`${ROUTES.ADMINS.BASE}${ROUTES.ADMINS.BLOCK(input.adminId)}`,
		);
		return response.data;
	},

	unblockAdmin: async (input: UnblockAdminInput): Promise<ApiSuccess> => {
		const response = await api.patch(
			`${ROUTES.ADMINS.BASE}${ROUTES.ADMINS.UNBLOCK(input.adminId)}`,
		);
		return response.data;
	},
};

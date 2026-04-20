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
	getAdmins: async (params: GetAdminsInput): Promise<GetAdminsResponse> => {
		const response = await api.get(
			`${ROUTES.ADMIN_MANAGEMENT.BASE}${ROUTES.ADMIN_MANAGEMENT.FETCH_ADMINS}`,
			{
				params,
			},
		);
		return response.data.data;
	},

	createAdmin: async (
		input: CreateAdminInput,
	): Promise<ApiSuccess<CreateAdminResponse>> => {
		const response = await api.post(
			`${ROUTES.ADMIN_MANAGEMENT.BASE}${ROUTES.ADMIN_MANAGEMENT.CREATE_ADMIN}`,
			input,
		);

		return response.data;
	},

	blockAdmin: async (input: BlockAdminInput): Promise<ApiSuccess> => {
		const response = await api.patch(
			`${ROUTES.ADMIN_MANAGEMENT.BASE}${ROUTES.ADMIN_MANAGEMENT.BLOCK(input.adminId)}`,
		);
		return response.data;
	},

	unblockAdmin: async (input: UnblockAdminInput): Promise<ApiSuccess> => {
		const response = await api.patch(
			`${ROUTES.ADMIN_MANAGEMENT.BASE}${ROUTES.ADMIN_MANAGEMENT.UNBLOCK(input.adminId)}`,
		);
		return response.data;
	},
};

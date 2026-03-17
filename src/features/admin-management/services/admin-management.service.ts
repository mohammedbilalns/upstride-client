import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	BlockAdminInput,
	CreateAdminInput,
	GetAdminsInput,
	GetAdminsResponse,
	UnblockAdminInput,
} from "../types";

export const AdminManagementService = {
	getAdmins: async (params: GetAdminsInput): Promise<GetAdminsResponse> => {
		const response = await api.get<{
			message: string;
			data: GetAdminsResponse;
		}>(
			`${ROUTES.ADMIN_MANAGEMENT.BASE}${ROUTES.ADMIN_MANAGEMENT.FETCH_ADMINS}`,
			{
				params,
			},
		);
		return response.data.data;
	},

	createAdmin: async (input: CreateAdminInput): Promise<void> => {
		await api.post(
			`${ROUTES.ADMIN_MANAGEMENT.BASE}${ROUTES.ADMIN_MANAGEMENT.CREATE_ADMIN}`,
			input,
		);
	},

	blockAdmin: async (input: BlockAdminInput): Promise<void> => {
		await api.patch(
			`${ROUTES.ADMIN_MANAGEMENT.BASE}${ROUTES.ADMIN_MANAGEMENT.BLOCK(input.adminId)}`,
		);
	},

	unblockAdmin: async (input: UnblockAdminInput): Promise<void> => {
		await api.patch(
			`${ROUTES.ADMIN_MANAGEMENT.BASE}${ROUTES.ADMIN_MANAGEMENT.UNBLOCK(input.adminId)}`,
		);
	},
};

import { ROUTES } from "@/api/routes";
import api from "@/api/axios";
import type {
    GetUsersInput,
    GetUsersResponse,
    BlockUserInput,
    UnblockUserInput
} from "../types";

export const UserManagementService = {
    getUsers: async (params: GetUsersInput): Promise<GetUsersResponse> => {
        const response = await api.get<{ message: string; data: GetUsersResponse }>(
            ROUTES.USER_MANAGEMENT.BASE,
            { params },
        );
        return response.data.data;
    },

    blockUser: async (input: BlockUserInput): Promise<void> => {
        await api.patch(
            `${ROUTES.USER_MANAGEMENT.BASE}${ROUTES.USER_MANAGEMENT.BLOCK(input.userId)}`,
        );
    },

    unblockUser: async (input: UnblockUserInput): Promise<void> => {
        await api.patch(
            `${ROUTES.USER_MANAGEMENT.BASE}${ROUTES.USER_MANAGEMENT.UNBLOCK(input.userId)}`,
        );
    },
};

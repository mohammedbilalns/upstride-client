import {
	keepPreviousData,
	queryOptions,
	useQuery,
} from "@tanstack/react-query";
import { UserManagementService } from "../services/user-management.service";
import type { GetUsersInput } from "../types";

export const userManagementQueryOptions = (params: GetUsersInput) =>
	queryOptions({
		queryKey: ["users", params],
		queryFn: () => UserManagementService.getUsers(params),
		placeholderData: keepPreviousData,
	});

export function useUsers(params: GetUsersInput) {
	return useQuery(userManagementQueryOptions(params));
}

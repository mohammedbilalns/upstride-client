import {
	keepPreviousData,
	queryOptions,
	useQuery,
} from "@tanstack/react-query";
import { AdminManagementService } from "../../services/admin.service";
import type { GetAdminsInput } from "../../types";

export const adminManagementQueryOptions = (params: GetAdminsInput) =>
	queryOptions({
		queryKey: ["admins", params],
		queryFn: () => AdminManagementService.getAdmins(params),
		placeholderData: keepPreviousData,
	});

export function useAdmins(params: GetAdminsInput) {
	return useQuery(adminManagementQueryOptions(params));
}

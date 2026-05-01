import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/api/apiError";
import { updateQueryCache } from "@/shared/utils/updateQueryCache";
import { AdminManagementService } from "../../services/admin.service";
import type { GetAdminsResponse } from "../../types";

export function useBlockAdmin() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: AdminManagementService.blockAdmin,
		onSuccess: ({ message }, variables) => {
			toast.success(message ?? "Admin blocked successfully");

			updateQueryCache<GetAdminsResponse>(queryClient, ["admins"], (oldData) =>
				updateAdminStatus(oldData, variables.adminId, "blocked"),
			);
		},
		onError: (error: ApiError) => {
			toast.error(error.message ?? "Failed to block admin");
		},
	});
}

export function updateAdminStatus(
	data: GetAdminsResponse,
	adminId: string,
	status: "active" | "blocked",
): GetAdminsResponse {
	return {
		...data,
		admins: data.admins.map((admin) =>
			admin.id === adminId ? { ...admin, status } : admin,
		),
	};
}

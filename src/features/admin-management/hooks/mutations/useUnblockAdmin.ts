import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateQueryCache } from "@/shared/utils/updateQueryCache";
import { AdminManagementService } from "../../services/admin.service";
import type { GetAdminsResponse } from "../../types";

export function useUnblockAdmin() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: AdminManagementService.unblockAdmin,
		onSuccess: ({ message }, variables) => {
			toast.success(message || "Admin unblocked successfully");
			updateQueryCache<GetAdminsResponse>(queryClient, ["admins"], (oldData) =>
				updateAdminStatus(oldData, variables.adminId, "active"),
			);
		},
		onError: (error: Error) => {
			toast.error(error?.message || "Failed to unblock admin");
		},
	});
}

function updateAdminStatus(
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

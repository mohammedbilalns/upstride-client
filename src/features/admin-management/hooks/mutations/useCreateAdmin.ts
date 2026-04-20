import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateQueryCache } from "@/shared/utils/updateQueryCache";
import { AdminManagementService } from "../../services/admin.service";
import type { GetAdminsResponse } from "../../types";

export function useCreateAdmin() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: AdminManagementService.createAdmin,
		onSuccess: ({ message, data }, variables) => {
			toast.success(message || "Created Admin successfully");

			updateQueryCache<GetAdminsResponse>(queryClient, ["admins"], (oldData) =>
				insertAdmin(oldData, {
					id: data.newAdminId,
					name: variables.email.split("@")[0].trim(),
					email: variables.email,
					addedAt: new Date().toISOString(),
					status: "active",
				}),
			);
		},
		onError: (error: Error) => {
			toast.error(error.message ?? "Failed to create admin");
		},
	});
}

function insertAdmin(
	data: GetAdminsResponse,
	newAdmin: GetAdminsResponse["admins"][number],
): GetAdminsResponse {
	return {
		...data,
		admins: [newAdmin, ...data.admins],
		total: data.total + 1,
	};
}

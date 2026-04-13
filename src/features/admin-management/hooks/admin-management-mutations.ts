import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/api/apiError";
import { updateQueryCache } from "@/shared/utils/update-query-cache";
import { AdminManagementService } from "../services/admin-management.service";
import type { GetAdminsResponse } from "../types";

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

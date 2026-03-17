import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminManagementService } from "../services/admin-management.service";

export function useCreateAdmin() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: AdminManagementService.createAdmin,
		onSuccess: () => {
			toast.success("Admin created successfully");
			queryClient.invalidateQueries({ queryKey: ["admins"] });
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
		onSuccess: () => {
			toast.success("Admin blocked successfully");
			queryClient.invalidateQueries({ queryKey: ["admins"] });
		},
		onError: (error: Error) => {
			toast.error(error.message ?? "Failed to block admin");
		},
	});
}

export function useUnblockAdmin() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: AdminManagementService.unblockAdmin,
		onSuccess: () => {
			toast.success("Admin unblocked successfully");
			queryClient.invalidateQueries({ queryKey: ["admins"] });
		},
		onError: (error: Error) => {
			toast.error(error?.message || "Failed to unblock admin");
		},
	});
}

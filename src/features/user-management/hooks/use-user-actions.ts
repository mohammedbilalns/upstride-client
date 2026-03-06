import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserManagementService } from "../services/user-management.service";

export function useBlockUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: UserManagementService.blockUser,
		onSuccess: () => {
			toast.success("User blocked successfully");
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
		onError: (error: Error) => {
			toast.error(error.message ?? "Failed to block user");
		},
	});
}

export function useUnblockUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: UserManagementService.unblockUser,
		onSuccess: () => {
			toast.success("User unblocked successfully");
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
		onError: (error: Error) => {
			toast.error(error?.message || "Failed to unblock user");
		},
	});
}

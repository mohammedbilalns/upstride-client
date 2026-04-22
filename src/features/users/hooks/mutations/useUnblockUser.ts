import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateQueryCache } from "@/shared/utils/updateQueryCache";
import { UserManagementService } from "../../services/user.service";
import type { GetUsersResponse } from "../../types";

export function useUnblockUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: UserManagementService.unblockUser,
		onSuccess: ({ message, data }) => {
			toast.success(message || "User unblocked successfully");

			updateQueryCache<GetUsersResponse>(queryClient, ["users"], (oldData) =>
				updateUserStatus(oldData, data.resourceId, "active"),
			);
		},
		onError: (error: Error) => {
			toast.error(error?.message || "Failed to unblock user");
		},
	});
}

function updateUserStatus(
	data: GetUsersResponse,
	userId: string,
	status: "active" | "blocked",
): GetUsersResponse {
	return {
		...data,
		users: data.users.map((user) =>
			user.id === userId ? { ...user, status } : user,
		),
	};
}

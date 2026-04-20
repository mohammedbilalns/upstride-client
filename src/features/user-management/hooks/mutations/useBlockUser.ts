import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateQueryCache } from "@/shared/utils/updateQueryCache";
import { UserManagementService } from "../../services/user.service";
import type { GetUsersResponse } from "../../types";

export function useBlockUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: UserManagementService.blockUser,
		onSuccess: ({ message }, variables) => {
			toast.success(message || "User blocked successfully");

			updateQueryCache<GetUsersResponse>(queryClient, ["users"], (oldData) =>
				updateUserStatus(oldData, variables.userId, "blocked"),
			);
		},
		onError: (error: Error) => {
			toast.error(error.message ?? "Failed to block user");
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

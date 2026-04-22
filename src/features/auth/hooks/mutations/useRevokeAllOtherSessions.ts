import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/api/apiError";
import { authService } from "../../services/auth.service";
import type { ActiveSession } from "../../types";
import { activeSessionsQueryOptions } from "../queries/useActiveSessions";

export function useRevokeAllOtherSessions() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => authService.revokeAllOtherSessions(),
		onSuccess: () => {
			toast.success("Other sessions terminated successfully");

			queryClient.setQueryData<ActiveSession[]>(
				activeSessionsQueryOptions.queryKey,
				(oldSessions) =>
					oldSessions?.filter((session) => session.isCurrent) ?? [],
			);
		},
		onError: (error: ApiError) => {
			toast.error(
				error.response?.data?.message || "Failed to terminate other sessions",
			);
		},
	});
}

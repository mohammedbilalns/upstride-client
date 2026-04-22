import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/api/apiError";
import { authService } from "../../services/auth.service";
import type { ActiveSession } from "../../types";
import { activeSessionsQueryOptions } from "../queries/useActiveSessions";

export function useRevokeSession() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (sessionId: string) => authService.revokeSession(sessionId),
		onSuccess: (_, revokedSessionId) => {
			toast.success("Session terminated successfully");
			queryClient.setQueryData<ActiveSession[]>(
				activeSessionsQueryOptions.queryKey,
				(oldSessions) =>
					oldSessions?.filter((session) => session.id !== revokedSessionId) ??
					[],
			);
		},
		onError: (error: ApiError) => {
			toast.error(
				error.response?.data?.message || "Failed to terminate session",
			);
		},
	});
}

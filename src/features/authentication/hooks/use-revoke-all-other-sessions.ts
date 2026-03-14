import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/api/apiError";
import { authService } from "../services/auth.service";

export function useRevokeAllOtherSessions() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => authService.revokeAllOtherSessions(),
		onSuccess: () => {
			toast.success("Other sessions terminated successfully");
			queryClient.invalidateQueries({ queryKey: ["active-sessions"] });
		},
		onError: (error: ApiError) => {
			toast.error(
				error.response?.data?.message || "Failed to terminate other sessions",
			);
		},
	});
}

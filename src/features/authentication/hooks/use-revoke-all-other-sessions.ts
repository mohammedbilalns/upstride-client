import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { toast } from "sonner";

export function useRevokeAllOtherSessions() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => authService.revokeAllOtherSessions(),
		onSuccess: () => {
			toast.success("Other sessions terminated successfully");
			queryClient.invalidateQueries({ queryKey: ["active-sessions"] });
		},
		onError: (error: any) => {
			toast.error(
				error.response?.data?.message || "Failed to terminate other sessions",
			);
		},
	});
}

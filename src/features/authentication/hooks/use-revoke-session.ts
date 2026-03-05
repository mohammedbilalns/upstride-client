import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { toast } from "sonner";

export function useRevokeSession() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (sessionId: string) => authService.revokeSession(sessionId),
		onSuccess: () => {
			toast.success("Session terminated successfully");
			queryClient.invalidateQueries({ queryKey: ["active-sessions"] });
		},
		onError: (error: any) => {
			toast.error(
				error.response?.data?.message || "Failed to terminate session",
			);
		},
	});
}

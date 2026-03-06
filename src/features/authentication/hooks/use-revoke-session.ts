import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authService } from "../services/auth.service";

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

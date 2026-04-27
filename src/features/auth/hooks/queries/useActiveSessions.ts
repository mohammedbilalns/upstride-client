import { queryOptions, useQuery } from "@tanstack/react-query";
import { authService } from "../../services/auth.service";

export const activeSessionsQueryOptions = queryOptions({
	queryKey: ["active-sessions"],
	queryFn: async () => {
		const response = await authService.getActiveSessions();
		return response.data.sessions;
	},
});

export function useActiveSessions() {
	return useQuery(activeSessionsQueryOptions);
}

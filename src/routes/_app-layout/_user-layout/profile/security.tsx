import { createFileRoute } from "@tanstack/react-router";
import { activeSessionsQueryOptions } from "@/features/auth/hooks/queries/useActiveSessions";
import { ProfileSecurityPage } from "@/features/profile/pages/ProfileSecurityPage";

export const Route = createFileRoute(
	"/_app-layout/_user-layout/profile/security",
)({
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(activeSessionsQueryOptions);
	},
	component: ProfileSecurityPage,
});

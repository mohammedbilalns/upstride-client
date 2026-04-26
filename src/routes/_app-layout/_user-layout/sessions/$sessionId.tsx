import { createFileRoute } from "@tanstack/react-router";
import { UserSessionDetailsPage } from "@/features/sessions/pages/UserSessionDetailsPage";
import { sessionDetailsQueryOptions } from "@/features/sessions/hooks/queries/useSessionDetails";

export const Route = createFileRoute(
	"/_app-layout/_user-layout/sessions/$sessionId",
)({
	loader: async ({ context: { queryClient }, params }) => {
		await queryClient.ensureQueryData(
			sessionDetailsQueryOptions(params.sessionId),
		);
	},
	component: UserSessionDetailsPage,
});

import { createFileRoute } from "@tanstack/react-router";
import { MentorSessionDetailsPage } from "@/features/mentor-sessions/pages/MentorSessionDetailsPage";
import { sessionDetailsQueryOptions } from "@/features/sessions/hooks/queries/useSessionDetails";

export const Route = createFileRoute(
	"/_app-layout/_mentor-layout/mentor-sessions/$sessionId",
)({
	loader: async ({ context: { queryClient }, params }) => {
		await queryClient.ensureQueryData(
			sessionDetailsQueryOptions(params.sessionId),
		);
	},
	component: MentorSessionDetailsPage,
});

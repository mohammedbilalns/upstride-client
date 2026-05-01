import { createFileRoute } from "@tanstack/react-router";
import type { ApiError } from "@/api/apiError";
import ErrorComponent from "@/components/common/ErrorComponent";
import { MentorSessionDetailsPage } from "@/features/mentor-sessions/pages/MentorSessionDetailsPage";
import { SessionNotFound } from "@/features/sessions/components/SessionNotFound";
import { sessionDetailsQueryOptions } from "@/features/sessions/hooks/queries/useSessionDetails";

export const Route = createFileRoute(
	"/_app-layout/_mentor-layout/mentor-sessions/$sessionId",
)({
	loader: async ({ context: { queryClient }, params }) => {
		await queryClient.ensureQueryData(
			sessionDetailsQueryOptions(params.sessionId),
		);
	},
	errorComponent: ({ error }) => {
		const status = (error as ApiError).response?.status;

		if (status === 404 || status === 400) {
			return (
				<SessionNotFound
					backTo="/mentor-sessions"
					backLabel="Back to My Sessions"
				/>
			);
		}
		return <ErrorComponent error={error} />;
	},
	component: MentorSessionDetailsPage,
});

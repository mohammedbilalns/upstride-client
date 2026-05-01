import { createFileRoute } from "@tanstack/react-router";
import type { ApiError } from "@/api/apiError";
import ErrorComponent from "@/components/common/ErrorComponent";
import { SessionNotFound } from "@/features/sessions/components/SessionNotFound";
import { sessionDetailsQueryOptions } from "@/features/sessions/hooks/queries/useSessionDetails";
import { UserSessionDetailsPage } from "@/features/sessions/pages/UserSessionDetailsPage";

export const Route = createFileRoute(
	"/_app-layout/_user-layout/sessions/$sessionId",
)({
	loader: async ({ context: { queryClient }, params }) => {
		await queryClient.ensureQueryData(
			sessionDetailsQueryOptions(params.sessionId),
		);
	},
	errorComponent: ({ error }) => {
		const status = (error as ApiError).response?.status;

		if (status === 404 || status === 400) {
			return <SessionNotFound />;
		}
		return <ErrorComponent error={error} />;
	},
	component: UserSessionDetailsPage,
});

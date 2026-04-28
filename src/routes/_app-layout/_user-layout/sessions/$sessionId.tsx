import { createFileRoute } from "@tanstack/react-router";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFound";
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
		const status =
			(error as { response?: { status?: number } })?.response?.status ??
			(error as { status?: number })?.status;
		if (status === 404 || status === 400) {
			return <NotFoundComponent />;
		}
		return <ErrorComponent error={error} />;
	},
	component: UserSessionDetailsPage,
});

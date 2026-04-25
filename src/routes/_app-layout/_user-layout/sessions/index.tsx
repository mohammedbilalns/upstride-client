import { createFileRoute } from "@tanstack/react-router";
import { SessionsPage } from "@/features/sessions";
import { userSessionsQueryOptions } from "@/features/sessions/hooks/queries/useSessions";
import { SessionsSearchSchema } from "@/features/sessions/validators/sessions-params.schema";

export const Route = createFileRoute("/_app-layout/_user-layout/sessions/")({
	validateSearch: (search) => SessionsSearchSchema.parse(search),
	loaderDeps: ({ search }) => ({ search }),
	loader: async ({ context: { queryClient }, deps: { search } }) => {
		await queryClient.ensureQueryData(
			userSessionsQueryOptions({
				page: search.page,
				limit: search.limit,
				filter: search.filter,
			}),
		);
	},
	component: SessionsPage,
});

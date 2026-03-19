import { createFileRoute } from "@tanstack/react-router";
import { SessionsPage } from "@/features/sessions";
import { userSessionsQueryOptions } from "@/features/sessions/hooks/use-sessions";
import { SessionsSearchSchema } from "@/features/sessions/validators/sessions-params";

export const Route = createFileRoute("/_user-layout/sessions")({
	validateSearch: (search) => SessionsSearchSchema.parse(search),
	loaderDeps: ({ search }) => ({ search }),
	loader: async ({ context: { queryClient }, deps: { search } }) => {
		const filter = search.tab === "past" ? "past" : search.upcomingFilter;
		await queryClient.ensureQueryData(
			userSessionsQueryOptions({
				page: search.page,
				limit: search.limit,
				filter,
			}),
		);
	},
	component: SessionsPage,
});

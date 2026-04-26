import { createFileRoute } from "@tanstack/react-router";
import { MentorSessionsPage } from "@/features/mentor-sessions";
import { mentorSessionsQueryOptions } from "@/features/mentor-sessions/hooks/queries/useMentorSessions";
import { MentorSessionsSearchSchema } from "@/features/mentor-sessions/validators/mentor-sessions-params.schema";

export const Route = createFileRoute(
	"/_app-layout/_mentor-layout/mentor-sessions/",
)({
	validateSearch: (search) => MentorSessionsSearchSchema.parse(search),
	loaderDeps: ({ search }) => ({ search }),
	loader: async ({ context: { queryClient }, deps: { search } }) => {
		await queryClient.ensureQueryData(
			mentorSessionsQueryOptions({
				page: search.page,
				limit: search.limit,
				filter: search.filter,
			}),
		);
	},
	component: MentorSessionsPage,
});

import { createFileRoute } from "@tanstack/react-router";
import { mentorManagementQueryOptions } from "@/features/mentor-moderation/hooks/queries/useMentors";
import { MentorManagementPage } from "@/features/mentor-moderation/pages/MentorManagementPage";
import { MentorManagementSearchSchema } from "@/features/mentor-moderation/validators/mentor-management-params.schema";

export const Route = createFileRoute("/_admin-layout/mentor-management")({
	validateSearch: (search) => MentorManagementSearchSchema.parse(search),
	loaderDeps: ({ search }) => ({ search }),
	loader: ({ context: { queryClient }, deps: { search } }) =>
		queryClient.ensureQueryData(mentorManagementQueryOptions(search)),
	component: MentorManagementPage,
});

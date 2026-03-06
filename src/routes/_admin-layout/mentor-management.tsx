import { createFileRoute } from "@tanstack/react-router";
import { MentorManagementPage } from "@/features/mentor-management/pages/MentorManagementPage";
import { mentorManagementQueryOptions } from "@/features/mentor-management/hooks/use-mentors";
import { MentorManagementSearchSchema } from "@/shared/validators/mentor-management-params";

export const Route = createFileRoute("/_admin-layout/mentor-management")({
	validateSearch: (search) => MentorManagementSearchSchema.parse(search),
	loaderDeps: ({ search }) => ({ search }),
	loader: ({ context: { queryClient }, deps: { search } }) =>
		queryClient.ensureQueryData(mentorManagementQueryOptions(search)),
	component: MentorManagementPage,
});

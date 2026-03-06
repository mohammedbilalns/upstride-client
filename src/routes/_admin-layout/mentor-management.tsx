import { createFileRoute } from "@tanstack/react-router";
import { mentorManagementQueryOptions } from "@/features/mentor-management/hooks/use-mentors";
import { MentorManagementPage } from "@/features/mentor-management/pages/MentorManagementPage";
import { MentorManagementSearchSchema } from "@/features/mentor-management/validators/mentor-management-params";

export const Route = createFileRoute("/_admin-layout/mentor-management")({
	validateSearch: (search) => MentorManagementSearchSchema.parse(search),
	loaderDeps: ({ search }) => ({ search }),
	loader: ({ context: { queryClient }, deps: { search } }) =>
		queryClient.ensureQueryData(mentorManagementQueryOptions(search)),
	component: MentorManagementPage,
});

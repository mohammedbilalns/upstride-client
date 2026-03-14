import { createFileRoute } from "@tanstack/react-router";
import { MentorRegistrationView } from "@/features/mentor-registration/components/MentorRegistrationView";
import { professionsQueryOptions } from "@/features/mentor-registration/hooks/use-mentor-registration";

export const Route = createFileRoute("/_user-layout/mentor/register")({
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(professionsQueryOptions);
	},
	component: MentorRegistrationView,
});

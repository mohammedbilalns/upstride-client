import { createFileRoute } from "@tanstack/react-router";
import { professionsQueryOptions } from "@/features/mentor-registration/hooks/use-mentor-registration";
import { MentorRegistrationPage } from "@/features/mentor-registration/pages/MentorRegistrationPage";

export const Route = createFileRoute("/_user-layout/mentor/register")({
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(professionsQueryOptions);
	},
	component: MentorRegistrationPage,
});

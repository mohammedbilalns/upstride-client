import { createFileRoute } from "@tanstack/react-router";
import { profileQueryOptions } from "@/features/profile";
import { ProfileOverviewPage } from "@/features/profile/pages/ProfileOverviewPage";

export const Route = createFileRoute("/_app-layout/_user-layout/profile/")({
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(profileQueryOptions);
	},
	component: ProfileOverviewPage,
});

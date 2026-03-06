import { createFileRoute } from "@tanstack/react-router";
import { MentorRegistrationView } from "@/features/mentor-registration/components/MentorRegistrationView";
import { catalogService } from "@/features/mentor-registration/services/catalog.service";

export const Route = createFileRoute("/_user-layout/mentor/register")({
	loader: async ({ context }: any) => {
		await context.queryClient.ensureQueryData({
			queryKey: ["professions"],
			queryFn: async () => {
				const response = await catalogService.getProfessions();
				return response.data;
			},
		});
	},
	component: MentorRegistrationView,
});

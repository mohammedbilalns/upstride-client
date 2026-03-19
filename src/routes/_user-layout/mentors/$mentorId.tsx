import { createFileRoute } from "@tanstack/react-router";
import { PublicMentorProfilePage } from "@/features/mentor-public-profile/pages/PublicMentorProfilePage";
import { publicMentorProfileService } from "@/features/mentor-public-profile";
import type { ApiError } from "@/api/apiError";
import NotFoundComponent from "@/components/common/Not-Found";
import ErrorComponent from "@/components/common/Error-Component";

export const Route = createFileRoute("/_user-layout/mentors/$mentorId")({
	loader: async ({ context: { queryClient }, params }) => {
		await queryClient.ensureQueryData({
			queryKey: ["public-mentor-profile", params.mentorId],
			queryFn: () =>
				publicMentorProfileService.getPublicProfile(params.mentorId),
		});
	},
	component: MentorPublicProfileRoute,
	errorComponent: ({ error }) => {
		const status = (error as ApiError | undefined)?.response?.status;
		if (status === 404 || status === 400) {
			return <NotFoundComponent />;
		}
		return <ErrorComponent error={error} />;
	},
});

function MentorPublicProfileRoute() {
	const { mentorId } = Route.useParams();
	return <PublicMentorProfilePage mentorId={mentorId} />;
}

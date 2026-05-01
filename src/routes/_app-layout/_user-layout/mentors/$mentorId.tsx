import { createFileRoute } from "@tanstack/react-router";
import type { ApiError } from "@/api/apiError";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFound";
import { publicMentorProfileService } from "@/features/mentor-public-profile";
import { PublicMentorProfilePage } from "@/features/mentor-public-profile/pages/PublicMentorProfilePage";

export const Route = createFileRoute(
	"/_app-layout/_user-layout/mentors/$mentorId",
)({
	loader: async ({ context: { queryClient }, params }) => {
		await queryClient.ensureQueryData({
			queryKey: ["public-mentor-profile", params.mentorId],
			queryFn: () =>
				publicMentorProfileService.getPublicProfile(params.mentorId),
		});
	},
	component: MentorPublicProfileRoute,
	errorComponent: ({ error }) => {
		const status = (error as ApiError)?.response?.status;
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

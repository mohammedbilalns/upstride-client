import { createFileRoute } from "@tanstack/react-router";
import type { ApiError } from "@/api/apiError";
import ErrorComponent from "@/components/common/Error-Component";
import NotFoundComponent from "@/components/common/Not-Found";
import { publicMentorProfileService } from "@/features/mentor-public-profile";
import { PublicMentorProfilePage } from "@/features/mentor-public-profile/pages/PublicMentorProfilePage";

export const Route = createFileRoute(
	"/_admin-layout/admin-profiles/$profileId",
)({
	loader: async ({ context: { queryClient }, params }) => {
		await queryClient.ensureQueryData({
			queryKey: ["public-mentor-profile", params.profileId],
			queryFn: () =>
				publicMentorProfileService.getPublicProfile(params.profileId),
		});
	},
	component: AdminProfileRoute,
	errorComponent: ({ error }) => {
		const status = (error as ApiError | undefined)?.response?.status;
		if (status === 404 || status === 400) {
			return <NotFoundComponent />;
		}
		return <ErrorComponent error={error} />;
	},
});

function AdminProfileRoute() {
	const { profileId } = Route.useParams();
	return <PublicMentorProfilePage mentorId={profileId} />;
}

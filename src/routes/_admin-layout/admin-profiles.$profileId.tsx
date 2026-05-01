import { createFileRoute } from "@tanstack/react-router";
import type { ApiError } from "@/api/apiError";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFound";
import { publicMentorProfileService } from "@/features/mentor-public-profile";
import { PublicMentorProfilePage } from "@/features/mentor-public-profile/pages/PublicMentorProfilePage";

export const Route = createFileRoute(
	"/_admin-layout/admin-profiles/$profileId",
)({
	loader: async ({ context: { queryClient }, params }) => {
		await queryClient.ensureQueryData({
			queryKey: ["admin-mentor-profile", params.profileId],
			queryFn: () =>
				publicMentorProfileService.getPublicProfile(params.profileId),
		});
	},
	component: AdminProfileRoute,
	errorComponent: ({ error }) => {
		const status = (error as ApiError)?.response?.status;
		if (status === 404 || status === 400) {
			return <NotFoundComponent />;
		}
		return <ErrorComponent error={error} />;
	},
});

function AdminProfileRoute() {
	const { profileId } = Route.useParams();
	return <PublicMentorProfilePage mentorId={profileId} isAdminView={true} />;
}

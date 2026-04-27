import { createFileRoute } from "@tanstack/react-router";
import { mentorListKeys } from "@/features/mentor-discovery/hooks/queries/useMentorLists";
import { BookmarkedMentorsPage } from "@/features/mentor-discovery/pages/BookmarkedMentorsPage";
import { mentorListsService } from "@/features/mentor-discovery/services/lists.service";

export const Route = createFileRoute(
	"/_app-layout/_user-layout/profile/bookmarked-mentors/",
)({
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureQueryData({
			queryKey: mentorListKeys.lists(),
			queryFn: () => mentorListsService.getLists(),
		});
	},
	component: BookmarkedMentorsPage,
});

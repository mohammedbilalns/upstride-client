import { createFileRoute } from "@tanstack/react-router";
import { mentorListKeys } from "@/features/mentor-discovery/hooks/use-mentor-lists";
import { BookmarkedMentorListPage } from "@/features/mentor-discovery/pages/BookmarkedMentorListPage";
import { mentorListsService } from "@/features/mentor-discovery/services/mentor-lists.service";

export const Route = createFileRoute(
	"/_app-layout/_user-layout/profile/bookmarked-mentors/$listId",
)({
	loader: async ({ context: { queryClient }, params }) => {
		await queryClient.ensureQueryData({
			queryKey: mentorListKeys.list(params.listId),
			queryFn: () => mentorListsService.getList(params.listId),
		});
	},
	component: BookmarkedMentorListPage,
});

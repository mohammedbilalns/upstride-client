import { createFileRoute } from "@tanstack/react-router";
import type { ApiError } from "@/api/apiError";
import ErrorComponent from "@/components/common/ErrorComponent";
import { MentorListNotFound } from "@/features/mentor-discovery/components/MentorListNotFound";
import { mentorListKeys } from "@/features/mentor-discovery/hooks/queries/useMentorLists";
import { BookmarkedMentorListPage } from "@/features/mentor-discovery/pages/BookmarkedMentorListPage";
import { mentorListsService } from "@/features/mentor-discovery/services/lists.service";

export const Route = createFileRoute(
	"/_app-layout/_user-layout/profile/bookmarked-mentors/$listId",
)({
	loader: async ({ context: { queryClient }, params }) => {
		await queryClient.ensureQueryData({
			queryKey: mentorListKeys.list(params.listId),
			queryFn: () => mentorListsService.getList(params.listId),
		});
	},
	errorComponent: ({ error }) => {
		const status = (error as ApiError)?.response?.status;
		if (status === 404 || status === 400) {
			return <MentorListNotFound />;
		}
		return <ErrorComponent error={error} />;
	},
	component: BookmarkedMentorListPage,
});

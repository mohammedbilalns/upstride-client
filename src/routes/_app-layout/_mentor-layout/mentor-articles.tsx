import { createFileRoute } from "@tanstack/react-router";
import { articleQueries } from "@/features/article/hooks/queries";
import { MentorArticlesPage } from "@/features/article/pages/MentorArticlesPage";

export const Route = createFileRoute(
	"/_app-layout/_mentor-layout/mentor-articles",
)({
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureInfiniteQueryData(
			articleQueries.mentorListInfinite(),
		);
	},
	component: MentorArticlesPage,
});

import { createFileRoute } from "@tanstack/react-router";
import { MentorArticlesPage } from "@/features/article/pages/MentorArticlesPage";
import { articleQueries } from "@/features/article/hooks/queries";

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

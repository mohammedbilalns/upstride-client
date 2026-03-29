import { createFileRoute } from "@tanstack/react-router";
import { UpdateArticlePage } from "@/features/article/pages/UpdateArticlePage";
import { articleQueries } from "@/features/article/hooks/queries";

export const Route = createFileRoute(
	"/_app-layout/_user-layout/mentor/articles/$articleId/update",
)({
	loader: async ({ context: { queryClient }, params }) => {
		await queryClient.ensureQueryData(articleQueries.detail(params.articleId));
	},
	component: UpdateArticlePage,
});

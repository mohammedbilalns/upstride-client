import { createFileRoute } from "@tanstack/react-router";
import { articleQueries } from "@/features/article/hooks/queries";
import { ArticleDetailPage } from "@/features/article/pages/ArticleDetailPage";

export const Route = createFileRoute("/_user-layout/articles/$articleId/")({
	loader: async ({ context: { queryClient }, params }) => {
		await queryClient.ensureQueryData(articleQueries.detail(params.articleId));
	},
	component: ArticleDetailPage,
});

import { createFileRoute } from "@tanstack/react-router";
import ErrorComponent from "@/components/common/Error-Component";
import { ArticleNotFound } from "@/features/article/components/ArticleNotFound";
import { articleQueries } from "@/features/article/hooks/queries";
import { ArticleDetailPage } from "@/features/article/pages/ArticleDetailPage";

export const Route = createFileRoute(
	"/_app-layout/_user-layout/articles/$articleId/",
)({
	loader: async ({ context: { queryClient }, params }) => {
		await queryClient.ensureQueryData(articleQueries.detail(params.articleId));
	},
	errorComponent: ({ error }) => {
		const status =
			(error as { response?: { status?: number } })?.response?.status ??
			(error as { status?: number })?.status;
		if (status === 404 || status === 400) {
			return (
				<ArticleNotFound backTo="/articles" backLabel="Back to Articles" />
			);
		}
		return <ErrorComponent error={error} />;
	},
	component: UserArticleRoute,
});

function UserArticleRoute() {
	const { articleId } = Route.useParams();
	return <ArticleDetailPage articleId={articleId} />;
}

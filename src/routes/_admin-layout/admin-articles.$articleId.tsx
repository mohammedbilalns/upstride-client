import { createFileRoute } from "@tanstack/react-router";
import { articleQueries } from "@/features/article/hooks/queries";
import { ArticleDetailPage } from "@/features/article/pages/ArticleDetailPage";
import ErrorComponent from "@/components/common/Error-Component";
import { ArticleNotFound } from "@/features/article/components/ArticleNotFound";

export const Route = createFileRoute(
	"/_admin-layout/admin-articles/$articleId",
)({
	loader: async ({ context: { queryClient }, params }) => {
		await queryClient.ensureQueryData(articleQueries.detail(params.articleId));
	},
	errorComponent: ({ error }) => {
		const status =
			(error as { response?: { status?: number } })?.response?.status ??
			(error as { status?: number })?.status;
		if (status === 404) {
			return (
				<ArticleNotFound
					backTo="/report-management"
					backLabel="Back to Reports"
				/>
			);
		}
		return <ErrorComponent error={error} />;
	},
	component: AdminArticleRoute,
});

function AdminArticleRoute() {
	const { articleId } = Route.useParams();
	return <ArticleDetailPage articleId={articleId} isReadOnly={true} />;
}

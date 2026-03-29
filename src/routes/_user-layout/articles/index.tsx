import { createFileRoute } from "@tanstack/react-router";
import { articleSearchSchema } from "@/features/article/validators/article-search-params";
import { articleQueries } from "@/features/article/hooks/queries";
import { ArticlesPage } from "@/features/article/pages/ArticlesPage";

export const Route = createFileRoute("/_user-layout/articles/")({
	validateSearch: articleSearchSchema,
	loaderDeps: ({ search }) => ({
		page: search.page,
		search: search.search,
		skill: search.skill,
		category: search.category,
	}),
	loader: async ({ context: { queryClient }, deps }) => {
		await Promise.all([
			queryClient.ensureQueryData(articleQueries.list(deps as any)),
			queryClient.ensureQueryData(articleQueries.topTags()),
		]);
	},
	component: ArticlesPage,
});

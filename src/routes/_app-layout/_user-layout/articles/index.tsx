import { createFileRoute } from "@tanstack/react-router";
import { articleQueries } from "@/features/article/hooks/queries/useArticleQueries";
import { ArticlesPage } from "@/features/article/pages/ArticlesPage";
import {
	type ArticleSearch,
	articleSearchSchema,
} from "@/features/article/validators/article-search-params.schema";

export const Route = createFileRoute("/_app-layout/_user-layout/articles/")({
	validateSearch: articleSearchSchema,
	loaderDeps: ({ search }) => ({
		search: search.search,
		skill: search.skill,
		category: search.category,
	}),
	loader: async ({ context: { queryClient }, deps }) => {
		const searchParams: ArticleSearch = deps;
		await Promise.all([
			queryClient.ensureQueryData(
				articleQueries.list({ page: 1, ...searchParams }),
			),
			queryClient.ensureQueryData(articleQueries.topTags()),
		]);
	},
	component: ArticlesPage,
});

import { createFileRoute } from "@tanstack/react-router";
import { articleQueries } from "@/features/article/hooks/queries";
import { ArticlesPage } from "@/features/article/pages/ArticlesPage";
import { articleSearchSchema } from "@/features/article/validators/article-search-params";

export const Route = createFileRoute("/_app-layout/_user-layout/articles/")({
	validateSearch: articleSearchSchema,
	loaderDeps: ({ search }) => ({
		search: search.search,
		skill: search.skill,
		category: search.category,
	}),
	loader: async ({ context: { queryClient }, deps }) => {
		await Promise.all([
			queryClient.ensureQueryData(
				articleQueries.list({ page: 1, ...(deps as any) }),
			),
			queryClient.ensureQueryData(articleQueries.topTags()),
		]);
	},
	component: ArticlesPage,
});

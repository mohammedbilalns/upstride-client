import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { articleService } from "../services/article.service";
import type { GetArticlesInput } from "../types";

export const articleQueries = {
	all: ["articles"] as const,
	lists: () => [...articleQueries.all, "list"] as const,
	list: (params: GetArticlesInput) =>
		queryOptions({
			queryKey: [...articleQueries.lists(), "standard", params],
			queryFn: () => articleService.getArticles(params),
		}),
	listInfinite: (params: Omit<GetArticlesInput, "page">) =>
		infiniteQueryOptions({
			queryKey: [...articleQueries.lists(), "infinite", params],
			queryFn: ({ pageParam }) =>
				articleService.getArticles({
					...params,
					page: pageParam as number,
				}),
			initialPageParam: 1,
			getNextPageParam: (lastPage) =>
				lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
		}),
	topTags: () =>
		queryOptions({
			queryKey: [...articleQueries.all, "top-tags"],
			queryFn: () => articleService.getTopTags(),
		}),
	details: () => [...articleQueries.all, "detail"] as const,
	detail: (slug: string) =>
		queryOptions({
			queryKey: [...articleQueries.details(), slug],
			queryFn: () => articleService.getArticle(slug),
		}),
};

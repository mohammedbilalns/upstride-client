import { queryOptions } from "@tanstack/react-query";
import { articleService } from "../../services/article.service";
import type { GetArticlesInput } from "../../types";
import { articleKeys } from "./article.keys";

export const articleQueries = {
	list: (params: GetArticlesInput) =>
		queryOptions({
			queryKey: articleKeys.list(params),
			queryFn: () => articleService.getArticles(params),
		}),
	detail: (slug: string) =>
		queryOptions({
			queryKey: articleKeys.detail(slug),
			queryFn: () => articleService.getArticle(slug),
		}),
	topTags: () =>
		queryOptions({
			queryKey: articleKeys.topTags(),
			queryFn: () => articleService.getTopTags(),
		}),
};

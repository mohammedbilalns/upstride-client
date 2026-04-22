import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { articleService } from "../../services/article.service";
import { articleKeys } from "./article.keys";

export const articleCommentQueries = {
	list: (params: {
		articleId: string;
		page: number;
		parentId?: string | null;
	}) =>
		queryOptions({
			queryKey: articleKeys.comments(params),
			queryFn: ({ pageParam }) =>
				articleService.getComments({
					...params,
					page: pageParam as number,
				}),
		}),
	inifinite: (params: { articleId: string; parentId?: string | null }) =>
		infiniteQueryOptions({
			queryKey: articleKeys.commentsInfinite(params),
			queryFn: ({ pageParam }) =>
				articleService.getComments({
					...params,
					page: pageParam as number,
				}),
			initialPageParam: 1,
			getNextPageParam: (lastPage) =>
				lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
		}),
};

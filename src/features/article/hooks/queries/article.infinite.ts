import { infiniteQueryOptions } from "@tanstack/react-query";
import { articleService } from "../../services/article.service";
import type { GetArticlesInput, MentorArticlesStatus } from "../../types";
import { articleKeys } from "./article.keys";

export const articleInfiniteQueries = {
	list: (params: Omit<GetArticlesInput, "page">) =>
		infiniteQueryOptions({
			queryKey: articleKeys.infinteList(params),
			queryFn: ({ pageParam }) =>
				articleService.getArticles({
					...params,
					page: pageParam as number,
				}),
			initialPageParam: 1,
			getNextPageParam: (lastPage) =>
				lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
		}),
	mentorList: (
		params: { search?: string; status?: MentorArticlesStatus } = {},
	) =>
		infiniteQueryOptions({
			queryKey: articleKeys.mentorListInfinite(params),
			queryFn: ({ pageParam }) =>
				articleService.getMentorArticles({
					page: pageParam as number,
					...params,
				}),
			initialPageParam: 1,
			getNextPageParam: (lastPage) =>
				lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
		}),
};

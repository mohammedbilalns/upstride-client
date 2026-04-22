import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import { articleCommentQueries } from "../hooks/queries";
import type { ArticleComment, GetCommentsResponse } from "../types";

export const updateCommentsInfiniteCache = (
	queryClient: QueryClient,
	{
		articleId,
		parentId,
		updateFn,
	}: {
		articleId: string;
		parentId: string | null;
		updateFn: (oldPages: GetCommentsResponse[]) => GetCommentsResponse[];
	},
) => {
	const queryKey = articleCommentQueries.inifinite({
		articleId,
		parentId,
	}).queryKey;

	queryClient.setQueryData<InfiniteData<GetCommentsResponse> | undefined>(
		queryKey,
		(old) => {
			if (!old) return old;
			return {
				...old,
				pages: updateFn(old.pages),
			};
		},
	);
};

export const addCommentOptimistically = (
	queryClient: QueryClient,
	{
		articleId,
		parentId,
		comment,
	}: {
		articleId: string;
		parentId: string | null;
		comment: ArticleComment;
	},
) => {
	updateCommentsInfiniteCache(queryClient, {
		articleId,
		parentId,
		updateFn: (pages) =>
			pages.map((page, index) => {
				if (index === 0) {
					return {
						...page,
						items: [comment, ...page.items],
						total: (page.total || 0) + 1,
					};
				}
				return page;
			}),
	});
};

export const updateCommentOptimistically = (
	queryClient: QueryClient,
	{
		articleId,
		parentId,
		commentId,
		updates,
	}: {
		articleId: string;
		parentId: string | null;
		commentId: string;
		updates: Partial<ArticleComment>;
	},
) => {
	updateCommentsInfiniteCache(queryClient, {
		articleId,
		parentId,
		updateFn: (pages) =>
			pages.map((page) => ({
				...page,
				items: page.items.map((item: ArticleComment) =>
					item.id === commentId ? { ...item, ...updates } : item,
				),
			})),
	});
};

export const deleteCommentOptimistically = (
	queryClient: QueryClient,
	{
		articleId,
		parentId,
		commentId,
	}: {
		articleId: string;
		parentId: string | null;
		commentId: string;
	},
) => {
	updateCommentsInfiniteCache(queryClient, {
		articleId,
		parentId,
		updateFn: (pages) =>
			pages.map((page) => ({
				...page,
				items: page.items.map((item: ArticleComment) =>
					item.id === commentId
						? {
								...item,
								isActive: false,
								content: "[This comment has been deleted]",
								authorSnapshot: { name: "Deleted User" },
							}
						: item,
				),
			})),
	});
};

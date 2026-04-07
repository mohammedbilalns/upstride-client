import type { QueryClient } from "@tanstack/react-query";
import { articleQueries } from "../hooks/queries";
import type { ArticleCommentDto } from "../types";

export const updateCommentsInfiniteCache = (
	queryClient: QueryClient,
	{
		articleId,
		parentId,
		updateFn,
	}: {
		articleId: string;
		parentId: string | null;
		updateFn: (oldPages: any[]) => any[];
	},
) => {
	const queryKey = articleQueries.commentsInfinite({
		articleId,
		parentId,
	}).queryKey;

	queryClient.setQueryData(queryKey, (old: any) => {
		if (!old) return old;
		return {
			...old,
			pages: updateFn(old.pages),
		};
	});
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
		comment: ArticleCommentDto;
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
		updates: Partial<ArticleCommentDto>;
	},
) => {
	updateCommentsInfiniteCache(queryClient, {
		articleId,
		parentId,
		updateFn: (pages) =>
			pages.map((page) => ({
				...page,
				items: page.items.map((item: ArticleCommentDto) =>
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
				items: page.items.map((item: ArticleCommentDto) =>
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

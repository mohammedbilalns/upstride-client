import { useMutation, useQueryClient } from "@tanstack/react-query";
import { articleQueries } from "./queries";
import { toast } from "sonner";
import { articleService } from "../services/article.service";
import {
	addCommentOptimistically,
	deleteCommentOptimistically,
	updateCommentOptimistically,
} from "../utils/comment-cache";

export const useArticleMutations = () => {
	const queryClient = useQueryClient();

	const react = useMutation({
		mutationFn: async ({ articleId }: { articleId: string; slug: string }) => {
			return articleService.reactToArticle({ articleId });
		},
		onMutate: async (variables) => {
			await queryClient.cancelQueries({
				queryKey: articleQueries.detail(variables.slug).queryKey,
			});

			const previousData = queryClient.getQueryData(
				articleQueries.detail(variables.slug).queryKey,
			);

			queryClient.setQueryData(
				articleQueries.detail(variables.slug).queryKey,
				(old: any) => {
					if (!old) return old;
					const { article, userReaction } = old;
					const isLiked = userReaction === "LIKE";
					return {
						...old,
						userReaction: isLiked ? undefined : "LIKE",
						article: {
							...article,
							likesCount: Math.max(0, article.likesCount + (isLiked ? -1 : 1)),
						},
					};
				},
			);

			return { previousData };
		},
		onError: (_err, variables, context) => {
			if (context?.previousData) {
				queryClient.setQueryData(
					articleQueries.detail(variables.slug).queryKey,
					context.previousData,
				);
			}
			toast.error("Failed to update reaction");
		},
		onSettled: (_data, _error, variables) => {
			queryClient.invalidateQueries({
				queryKey: articleQueries.detail(variables.slug).queryKey,
			});
		},
	});

	const createComment = useMutation({
		mutationFn: async (variables: {
			articleId: string;
			content: string;
			parentId?: string | null;
			author?: { name: string; avatarUrl?: string };
			userId?: string;
		}) => {
			return articleService.createComment(variables);
		},
		onMutate: async (variables) => {
			const parentId = variables.parentId || null;
			const queryKey = articleQueries.commentsInfinite({
				articleId: variables.articleId,
				parentId,
			}).queryKey;

			await queryClient.cancelQueries({ queryKey });
			const previousComments = queryClient.getQueryData(queryKey);

			if (variables.author && variables.userId) {
				addCommentOptimistically(queryClient, {
					articleId: variables.articleId,
					parentId,
					comment: {
						id: `temp-${Date.now()}`,
						articleId: variables.articleId,
						parentId,
						userId: variables.userId,
						content: variables.content,
						authorSnapshot: variables.author,
						likesCount: 0,
						repliesCount: 0,
						isActive: true,
						createdAt: new Date().toISOString(),
						updatedAt: new Date().toISOString(),
					},
				});
			}

			return { previousComments, queryKey };
		},
		onError: (_err, _variables, context) => {
			if (context?.previousComments) {
				queryClient.setQueryData(context.queryKey, context.previousComments);
			}
			toast.error("Failed to post comment");
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["articles", variables.articleId, "comments-infinite"],
			});
			toast.success("Comment posted successfully");
		},
	});

	const deleteComment = useMutation({
		mutationFn: async (variables: {
			articleId: string;
			commentId: string;
			parentId?: string | null;
		}) => {
			return articleService.deleteComment(variables);
		},
		onMutate: async (variables) => {
			const parentId = variables.parentId || null;
			const queryKey = articleQueries.commentsInfinite({
				articleId: variables.articleId,
				parentId,
			}).queryKey;

			await queryClient.cancelQueries({ queryKey });
			const previousComments = queryClient.getQueryData(queryKey);

			deleteCommentOptimistically(queryClient, {
				articleId: variables.articleId,
				parentId,
				commentId: variables.commentId,
			});

			return { previousComments, queryKey };
		},
		onError: (_err, _variables, context) => {
			if (context?.previousComments) {
				queryClient.setQueryData(context.queryKey, context.previousComments);
			}
			toast.error("Failed to delete comment");
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["articles", variables.articleId, "comments-infinite"],
			});
			toast.success("Comment deleted");
		},
	});

	const report = useMutation({
		mutationFn: async ({
			targetId,
			targetType,
			reason,
			description,
		}: {
			targetId: string;
			targetType: "ARTICLE" | "USER";
			reason: string;
			description: string;
		}) => {
			if (targetType === "ARTICLE") {
				return articleService.reportArticle(targetId, { reason, description });
			}
			return articleService.reportUser(targetId, { reason, description });
		},
		onSuccess: () => {
			toast.success("Report submitted successfully");
		},
		onError: (error: Error) => {
			toast.error(error.message);
		},
	});

	const updateComment = useMutation({
		mutationFn: async (variables: {
			articleId: string;
			commentId: string;
			parentId?: string | null;
			content: string;
		}) => {
			return articleService.updateComment(variables);
		},
		onMutate: async (variables) => {
			const parentId = variables.parentId || null;
			const queryKey = articleQueries.commentsInfinite({
				articleId: variables.articleId,
				parentId,
			}).queryKey;

			await queryClient.cancelQueries({ queryKey });
			const previousComments = queryClient.getQueryData(queryKey);

			updateCommentOptimistically(queryClient, {
				articleId: variables.articleId,
				parentId,
				commentId: variables.commentId,
				updates: { content: variables.content },
			});

			return { previousComments, queryKey };
		},
		onError: (_err, _variables, context) => {
			if (context?.previousComments) {
				queryClient.setQueryData(context.queryKey, context.previousComments);
			}
			toast.error("Failed to update comment");
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["articles", variables.articleId, "comments-infinite"],
			});
			toast.success("Comment updated");
		},
	});

	return {
		react,
		createComment,
		updateComment,
		deleteComment,
		report,
	};
};

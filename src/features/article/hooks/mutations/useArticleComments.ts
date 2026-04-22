import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { articleService } from "../../services/article.service";
import {
	addCommentOptimistically,
	deleteCommentOptimistically,
	updateCommentOptimistically,
} from "../../utils/commentCache";
import { articleCommentQueries } from "../queries";

export function useArticleCommentMutations() {
	const queryClient = useQueryClient();

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
			const queryKey = articleCommentQueries.inifinite({
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
			const queryKey = articleCommentQueries.inifinite({
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
			const queryKey = articleCommentQueries.inifinite({
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
		createComment,
		updateComment,
		deleteComment,
	};
}

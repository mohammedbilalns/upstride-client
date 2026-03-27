import { useMutation, useQueryClient } from "@tanstack/react-query";
import { articleQueries } from "./queries";
import { toast } from "sonner";
import { articleService } from "../services/article.service";

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
		mutationFn: async ({
			articleId,
			content,
			parentId,
		}: {
			articleId: string;
			content: string;
			parentId?: string | null;
		}) => {
			return articleService.createComment({ articleId, content, parentId });
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["articles", variables.articleId],
			});
			toast.success("Comment posted successfully");
		},
		onError: () => {
			toast.error("Failed to post comment");
		},
	});

	const deleteComment = useMutation({
		mutationFn: async ({
			articleId: _,
			commentId,
		}: {
			articleId: string;
			commentId: string;
		}) => {
			return articleService.deleteComment({ commentId });
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["articles", variables.articleId],
			});
			toast.success("Comment deleted");
		},
		onError: () => {
			toast.error("Failed to delete comment");
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
		mutationFn: async ({
			articleId: _,
			commentId,
			content,
		}: {
			articleId: string;
			commentId: string;
			content: string;
		}) => {
			return articleService.updateComment({ commentId, content });
		},
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: ["articles", variables.articleId],
			});
			toast.success("Comment updated");
		},
		onError: () => {
			toast.error("Failed to update comment");
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

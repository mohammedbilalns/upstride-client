import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { articleService } from "../../services/article.service";
import { articleQueries } from "../queries";

export function useArticleReactionMutation() {
	const queryClient = useQueryClient();

	return useMutation({
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
}

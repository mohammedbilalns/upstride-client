import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/api/apiError";
import { articleQueries } from "../queries";
import { articleService } from "../../services/article.service";

export function useUpdateArticleMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: articleService.updateArticle,
		onSuccess: () => {
			toast.success("Article updated successfully");
			queryClient.invalidateQueries({ queryKey: articleQueries.all });
		},
		onError: (error: ApiError) => {
			const message = error.response?.data?.message;
			toast.error(message || "Failed to update article");
			console.error(error);
		},
	});
}

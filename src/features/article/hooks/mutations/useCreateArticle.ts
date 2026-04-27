import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { articleService } from "../../services/article.service";
import { articleKeys } from "../queries/article.keys";

export function useCreateArticleMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: articleService.createArticle,
		onSuccess: () => {
			toast.success("Article created successfully");
			queryClient.invalidateQueries({ queryKey: articleKeys.all });
		},
		onError: (error) => {
			toast.error("Failed to create article");
			console.error(error);
		},
	});
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { articleQueries } from "../queries";
import { articleService } from "../../services/article.service";

export function useCreateArticleMutation() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: articleService.createArticle,
		onSuccess: () => {
			toast.success("Article created successfully");
			queryClient.invalidateQueries({ queryKey: articleQueries.all });
		},
		onError: (error) => {
			toast.error("Failed to create article");
			console.error(error);
		},
	});
}

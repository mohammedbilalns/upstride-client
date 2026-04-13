import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { articleService } from "../../services/article.service";

export function useArticleReportMutation() {
	return useMutation({
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
}

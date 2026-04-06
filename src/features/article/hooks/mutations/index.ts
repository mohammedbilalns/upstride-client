import { useArticleCommentMutations } from "./use-article-comments";
import { useArticleReactionMutation } from "./use-article-reaction";
import { useArticleReportMutation } from "./use-article-report";

export function useArticleMutations() {
	const react = useArticleReactionMutation();
	const { createComment, updateComment, deleteComment } =
		useArticleCommentMutations();
	const report = useArticleReportMutation();

	return {
		react,
		createComment,
		updateComment,
		deleteComment,
		report,
	};
}

export { useArticleCommentMutations } from "./use-article-comments";
export { useArticleReactionMutation } from "./use-article-reaction";
export { useArticleReportMutation } from "./use-article-report";
export { useCreateArticleMutation } from "./use-create-article";
export { useUpdateArticleMutation } from "./use-update-article";

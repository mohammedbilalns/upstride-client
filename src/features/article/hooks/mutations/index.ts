import { useArticleCommentMutations } from "./useArticleComments";
import { useArticleReactionMutation } from "./useArticleReaction";
import { useArticleReportMutation } from "./useArticleReport";

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

export { useArticleCommentMutations } from "./useArticleComments";
export { useArticleReactionMutation } from "./useArticleReaction";
export { useArticleReportMutation } from "./useArticleReport";
export { useCreateArticleMutation } from "./useCreateArticle";
export { useUpdateArticleMutation } from "./useUpdateArticle";

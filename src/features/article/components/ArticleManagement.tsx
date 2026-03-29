import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { articleService } from "../services/article.service";

interface ArticleManagementProps {
	articleId: string;
	slug: string;
	isAuthor: boolean;
	isBlockedByAdmin?: boolean;
}

export function ArticleManagement({
	articleId,
	slug,
	isAuthor,
	isBlockedByAdmin = false,
}: ArticleManagementProps) {
	const [isDeleting, setIsDeleting] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const navigate = useNavigate();

	if (!isAuthor) return null;

	const handleDelete = async () => {
		try {
			setIsDeleting(true);
			await articleService.deleteArticle({ articleId });
			toast.success("Article deleted successfully");
			navigate({ to: "/mentor-articles" });
		} catch (error) {
			toast.error("Failed to delete article");
			console.error(error);
		} finally {
			setIsDeleting(false);
			setShowDeleteConfirm(false);
		}
	};

	return (
		<div className="flex items-center gap-2">
			<Button
				variant="outline"
				size="sm"
				onClick={() =>
					navigate({
						to: "/mentor/articles/$articleId/update",
						params: { articleId: slug } as any,
					})
				}
				className="h-9 px-4 rounded-xl border-primary/30 text-primary hover:bg-primary/10 dark:border-primary/40 dark:hover:bg-primary/20"
			>
				<Edit2 className="h-4 w-4 mr-2" />
				Edit
			</Button>
			<Button
				variant="outline"
				size="sm"
				onClick={() => setShowDeleteConfirm(true)}
				disabled={isBlockedByAdmin}
				className="h-9 px-4 rounded-xl border-red-200 dark:border-red-900/30 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				<Trash2 className="h-4 w-4 mr-2" />
				Delete
			</Button>

			<ConfirmModal
				isOpen={showDeleteConfirm}
				onClose={() => setShowDeleteConfirm(false)}
				onConfirm={handleDelete}
				title="Delete Article"
				message="Are you sure you want to delete this article? This action cannot be undone."
				confirmText="Delete"
				variant="destructive"
				isLoading={isDeleting}
			/>
		</div>
	);
}

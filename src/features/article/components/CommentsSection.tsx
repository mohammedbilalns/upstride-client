import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Loader2, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/Dialog";
import { useArticleMutations } from "../hooks/mutations";
import { articleCommentQueries } from "../hooks/queries";
import { articleKeys } from "../hooks/queries/article.keys";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";

interface CommentsSectionProps {
	articleId: string;
	currentUserId?: string;
	isReadOnly?: boolean;
}

export function CommentsSection({
	articleId,
	currentUserId,
	isReadOnly = false,
}: CommentsSectionProps) {
	const queryClient = useQueryClient();
	const {
		data,
		isLoading,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
		error,
	} = useInfiniteQuery(
		articleCommentQueries.inifinite({ articleId, parentId: null }),
	);

	const { deleteComment } = useArticleMutations();
	const [deletingComment, setDeletingComment] = useState<{
		id: string;
		parentId: string | null;
	} | null>(null);

	const comments = data?.pages.flatMap((page) => page.items) || [];

	if (isLoading) {
		return (
			<div className="space-y-6 animate-pulse">
				{[1, 2, 3].map((i) => (
					<div key={i} className="flex gap-4">
						<div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
						<div className="flex-1 space-y-3">
							<div className="h-4 w-1/4 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
							<div className="h-20 w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
						</div>
					</div>
				))}
			</div>
		);
	}

	if (error) {
		return (
			<div className="py-12 text-center text-red-500 bg-red-50/50 dark:bg-red-950/10 rounded-3xl border border-red-100/50 dark:border-red-900/20">
				<AlertTriangle className="h-8 w-8 mx-auto mb-3 opacity-50" />
				<p className="font-semibold text-sm tracking-tight">
					Failed to load comments
				</p>
				<p className="text-xs opacity-70 mt-1">
					Please refresh the page and try again.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-10">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
						<MessageSquare className="h-5 w-5" />
					</div>
					<div>
						<h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
							Discussion
						</h3>
					</div>
				</div>
			</div>

			{!isReadOnly && (
				<div className="bg-white/40 dark:bg-zinc-950/20 p-2 rounded-[28px] border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm backdrop-blur-sm">
					<div className="bg-white dark:bg-zinc-900/40 p-5 rounded-[22px] border border-zinc-100 dark:border-zinc-800/60">
						<CommentForm
							articleId={articleId}
							onSuccess={() => {
								queryClient.invalidateQueries({
									queryKey: articleKeys.all,
								});
							}}
						/>
					</div>
				</div>
			)}

			<div className="space-y-2">
				{comments.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-20 text-center bg-zinc-50/50 dark:bg-zinc-900/20 rounded-4xl border border-dashed border-zinc-200/60 dark:border-zinc-800/60">
						<div className="h-14 w-14 rounded-full bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-center mb-4 text-zinc-300">
							<MessageSquare className="h-7 w-7" />
						</div>
						<h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
							No comments yet
						</h4>
						<p className="text-xs text-zinc-500 max-w-45 mt-1 mx-auto">
							Join the conversation and be the first to share your perspective!
						</p>
					</div>
				) : (
					comments.map((comment) => (
						<CommentItem
							key={comment.id}
							articleId={articleId}
							comment={comment}
							currentUserId={currentUserId}
							onEdit={() => {}}
							onDelete={(id, pId) =>
								setDeletingComment({ id, parentId: pId ?? null })
							}
						/>
					))
				)}
			</div>

			<Dialog
				open={!!deletingComment}
				onOpenChange={() => setDeletingComment(null)}
			>
				<DialogContent className="sm:max-w-106.25">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2 text-red-600">
							<AlertTriangle className="h-5 w-5" />
							Delete Comment?
						</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete this comment? This action cannot
							be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="gap-2 sm:gap-0">
						<Button
							variant="ghost"
							onClick={() => setDeletingComment(null)}
							disabled={deleteComment.isPending}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={async () => {
								if (deletingComment) {
									await deleteComment.mutateAsync({
										articleId,
										commentId: deletingComment.id,
										parentId: deletingComment.parentId,
									});
									setDeletingComment(null);
								}
							}}
							disabled={deleteComment.isPending}
						>
							{deleteComment.isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Deleting...
								</>
							) : (
								"Delete"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{hasNextPage && (
				<div className="pt-4 flex justify-center">
					<Button
						variant="outline"
						onClick={() => fetchNextPage()}
						disabled={isFetchingNextPage}
						className="rounded-full px-8 border-primary/30 text-primary hover:bg-primary/10 dark:border-primary/40 dark:hover:bg-primary/20"
					>
						{isFetchingNextPage ? "Loading..." : "View more comments"}
					</Button>
				</div>
			)}
		</div>
	);
}

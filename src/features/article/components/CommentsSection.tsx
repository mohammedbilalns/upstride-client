import {
	MessageSquare,
	MoreVertical,
	Trash2,
	Pencil,
	AlertTriangle,
	Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useInfiniteQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import { articleQueries } from "../hooks/queries";
import { useArticleMutations } from "../hooks/mutations";
import { CommentForm } from "./CommentForm";

interface CommentsSectionProps {
	articleId: string;
	currentUserId?: string;
}

export function CommentsSection({
	articleId,
	currentUserId,
}: CommentsSectionProps) {
	const {
		data,
		isLoading,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
		error,
	} = useInfiniteQuery(articleQueries.commentsInfinite({ articleId }));

	const { deleteComment } = useArticleMutations();
	const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
	const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
		null,
	);

	const comments = data?.pages.flatMap((page) => page.items) || [];
	const totalComments = data?.pages[0]?.total || 0;

	if (isLoading) {
		return (
			<div className="space-y-4 animate-pulse">
				{[1, 2, 3].map((i) => (
					<div key={i} className="flex gap-4">
						<div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
						<div className="flex-1 space-y-2">
							<div className="h-4 w-1/4 bg-zinc-200 dark:bg-zinc-800 rounded" />
							<div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded" />
						</div>
					</div>
				))}
			</div>
		);
	}

	if (error) {
		return (
			<div className="py-8 text-center text-red-500 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-100 dark:border-red-900/30">
				Failed to load comments. Please try again later.
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<div className="flex items-center justify-between">
				<h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
					<MessageSquare className="h-6 w-6 text-primary" />
					Comments ({totalComments})
				</h3>
			</div>

			<div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800">
				<CommentForm articleId={articleId} />
			</div>

			<div className="space-y-6">
				{comments.length === 0 ? (
					<div className="text-center py-12 text-zinc-500">
						No comments yet. Be the first to share your thoughts!
					</div>
				) : (
					comments.map((comment) => (
						<div key={comment.id} className="flex gap-4 group">
							<Avatar className="h-10 w-10 shrink-0 border border-zinc-100 dark:border-zinc-800">
								<AvatarImage src={comment.authorSnapshot.avatarUrl} />
								<AvatarFallback>
									{comment.authorSnapshot.name.charAt(0)}
								</AvatarFallback>
							</Avatar>
							<div className="flex-1 space-y-1">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<span className="font-bold text-sm text-zinc-900 dark:text-zinc-50">
											{comment.authorSnapshot.name}
										</span>
										<span className="text-xs text-zinc-500">
											{format(new Date(comment.createdAt), "MMM d, yyyy")}
										</span>
									</div>
									{currentUserId === comment.userId && (
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													size="icon"
													className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
												>
													<MoreVertical className="h-4 w-4 text-zinc-500" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuItem
													onClick={() => setEditingCommentId(comment.id)}
												>
													<Pencil className="h-4 w-4 mr-2" />
													Edit
												</DropdownMenuItem>
												<DropdownMenuItem
													className="text-red-600 focus:text-red-500"
													onClick={() => setDeletingCommentId(comment.id)}
												>
													<Trash2 className="h-4 w-4 mr-2" />
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									)}
								</div>
								{editingCommentId === comment.id ? (
									<div className="mt-2 bg-white dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
										<CommentForm
											articleId={articleId}
											commentId={comment.id}
											initialContent={comment.content}
											onSuccess={() => setEditingCommentId(null)}
											onCancel={() => setEditingCommentId(null)}
										/>
									</div>
								) : (
									<p className="text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
										{comment.content}
									</p>
								)}
							</div>
						</div>
					))
				)}
			</div>

			<Dialog
				open={!!deletingCommentId}
				onOpenChange={() => setDeletingCommentId(null)}
			>
				<DialogContent className="sm:max-w-[425px]">
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
							onClick={() => setDeletingCommentId(null)}
							disabled={deleteComment.isPending}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={async () => {
								if (deletingCommentId) {
									await deleteComment.mutateAsync({
										articleId,
										commentId: deletingCommentId,
									});
									setDeletingCommentId(null);
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

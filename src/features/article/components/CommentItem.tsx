import { memo, useCallback, useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
	ChevronDown,
	ChevronUp,
	Loader2,
	MessageSquare,
	MoreVertical,
	Pencil,
	Reply,
	Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { cn } from "@/shared/utils/cn";
import { articleCommentQueries } from "../hooks/queries";
import type { ArticleComment } from "../types";
import { CommentForm } from "./CommentForm";

interface CommentItemProps {
	articleId: string;
	comment: ArticleComment;
	currentUserId?: string;
	onDelete: (commentId: string, parentId?: string | null) => void;
	isReply?: boolean;
}

export const CommentItem = memo(function CommentItem({
	articleId,
	comment,
	currentUserId,
	onDelete,
	isReply = false,
}: CommentItemProps) {
	const [isReplying, setIsReplying] = useState(false);
	const [showReplies, setShowReplies] = useState(false);
	const [isEditing, setIsEditing] = useState(false);

	const {
		data: repliesData,
		fetchNextPage: fetchNextReplies,
		hasNextPage: hasNextReplies,
		isFetchingNextPage: isFetchingNextReplies,
		isLoading: isLoadingReplies,
	} = useInfiniteQuery({
		...articleCommentQueries.inifinite({ articleId, parentId: comment.id }),
		enabled: showReplies,
	});

	const replies = useMemo(
		() => repliesData?.pages.flatMap((page) => page.items) ?? [],
		[repliesData],
	);

	const handleReplySuccess = useCallback(() => {
		setIsReplying(false);
		setShowReplies(true);
	}, []);

	const handleEditSuccess = useCallback(() => {
		setIsEditing(false);
	}, []);

	const handleEditCancel = useCallback(() => {
		setIsEditing(false);
	}, []);

	const handleReplyCancel = useCallback(() => {
		setIsReplying(false);
	}, []);

	const handleDelete = useCallback(() => {
		onDelete(comment.id, comment.parentId);
	}, [comment.id, comment.parentId, onDelete]);

	return (
		<div
			className={cn(
				"group rounded-2xl transition-all duration-300",
				!isReply && "mb-6",
			)}
		>
			<div className="flex gap-4">
				<div className="flex flex-col items-center gap-2">
					{comment.isActive ? (
						<Avatar className="h-10 w-10 shrink-0 border border-zinc-100 dark:border-zinc-800 shadow-sm">
							<AvatarImage src={comment.authorSnapshot.avatarUrl} />
							<AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
								{comment.authorSnapshot.name.charAt(0).toUpperCase()}
							</AvatarFallback>
						</Avatar>
					) : (
						<div className="h-10 w-10 flex items-center justify-center">
							<div className="h-2 w-2 rounded-full bg-zinc-200 dark:bg-zinc-800" />
						</div>
					)}
					{showReplies && replies.length > 0 && (
						<div className="w-0.5 grow bg-zinc-100 dark:bg-zinc-800 rounded-full" />
					)}
				</div>

				<div className="flex-1 min-w-0 space-y-2">
					<div
						className={cn(
							"border rounded-2xl p-4 shadow-sm transition-all",
							comment.isActive
								? "bg-white/60 dark:bg-zinc-950/40 border-zinc-100 dark:border-zinc-800/60 group-hover:shadow-md group-hover:border-zinc-200 dark:group-hover:border-zinc-700"
								: "bg-zinc-50/50 dark:bg-zinc-900/20 border-zinc-100 dark:border-zinc-800/40 opacity-70",
						)}
					>
						<div className="flex items-center justify-between mb-1">
							<div className="flex items-center gap-2">
								{comment.isActive && (
									<span className="font-bold text-sm text-zinc-900 dark:text-zinc-50">
										{comment.authorSnapshot.name}
									</span>
								)}
								{comment.isActive && (
									<span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
								)}
								<span className="text-[10px] font-medium text-zinc-500 uppercase tracking-tight">
									{formatDistanceToNow(new Date(comment.createdAt), {
										addSuffix: true,
									})}
								</span>
							</div>
							{currentUserId === comment.userId &&
								comment.isActive &&
								!isEditing && (
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900"
											>
												<MoreVertical className="h-4 w-4 text-zinc-500" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end" className="rounded-xl">
											<DropdownMenuItem
												onClick={() => setIsEditing(true)}
												className="rounded-lg"
											>
												<Pencil className="h-4 w-4 mr-2" />
												Edit
											</DropdownMenuItem>
											<DropdownMenuItem
												className="text-red-600 focus:text-red-500 rounded-lg"
												onClick={handleDelete}
											>
												<Trash2 className="h-4 w-4 mr-2" />
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								)}
						</div>

						{isEditing ? (
							<div className="mt-2">
								<CommentForm
									articleId={articleId}
									commentId={comment.id}
									parentId={comment.parentId}
									initialContent={comment.content}
									onSuccess={handleEditSuccess}
									onCancel={handleEditCancel}
								/>
							</div>
						) : (
							<p
								className={cn(
									"text-[15px] leading-relaxed whitespace-pre-wrap wrap-break-word",
									comment.isActive
										? "text-zinc-700 dark:text-zinc-300"
										: "text-zinc-500 italic",
								)}
							>
								{comment.content}
							</p>
						)}
					</div>

					{/* Actions row */}
					<div className="flex items-center gap-4 px-2">
						{!isEditing && comment.isActive && (
							<button
								type="button"
								onClick={() => setIsReplying(!isReplying)}
								className={cn(
									"flex items-center gap-1.5 text-xs font-semibold transition-colors py-1 px-2 rounded-lg",
									isReplying
										? "text-primary bg-primary/10"
										: "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900",
								)}
							>
								<Reply className="h-3.5 w-3.5" />
								Reply
							</button>
						)}

						{comment.repliesCount > 0 && (
							<button
								type="button"
								onClick={() => setShowReplies(!showReplies)}
								className="flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 py-1 px-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
							>
								<MessageSquare className="h-3.5 w-3.5" />
								{showReplies ? "Hide" : "Show"} {comment.repliesCount}{" "}
								{comment.repliesCount === 1 ? "reply" : "replies"}
								{showReplies ? (
									<ChevronUp className="h-3.5 w-3.5 ml-0.5" />
								) : (
									<ChevronDown className="h-3.5 w-3.5 ml-0.5" />
								)}
							</button>
						)}
					</div>

					{/* Reply Form */}
					{isReplying && (
						<div className="mt-3 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
							<CommentForm
								articleId={articleId}
								parentId={comment.id}
								onSuccess={handleReplySuccess}
								onCancel={handleReplyCancel}
							/>
						</div>
					)}

					{/* Replies List */}
					{showReplies && (
						<div className="mt-4 pl-4 md:pl-8 space-y-4 border-l-2 border-zinc-100 dark:border-zinc-800/60 relative">
							{isLoadingReplies ? (
								<div className="flex items-center gap-2 text-zinc-400 text-sm py-2">
									<Loader2 className="h-4 w-4 animate-spin text-primary" />
									Loading replies...
								</div>
							) : (
								<>
									{replies.map((reply) => (
										<CommentItem
											key={reply.id}
											articleId={articleId}
											comment={reply}
											currentUserId={currentUserId}
											onDelete={onDelete}
											isReply={true}
										/>
									))}
									{hasNextReplies && (
										<button
											type="button"
											onClick={() => fetchNextReplies()}
											disabled={isFetchingNextReplies}
											className="text-[11px] font-bold text-primary hover:underline py-1 px-4 rounded-full bg-primary/5 hover:bg-primary/10 transition-all border border-primary/10"
										>
											{isFetchingNextReplies
												? "Loading..."
												: "Load more replies"}
										</button>
									)}
								</>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
});

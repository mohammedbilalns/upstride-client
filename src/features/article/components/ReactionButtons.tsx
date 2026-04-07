import { Heart } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { useArticleMutations } from "../hooks/mutations";

interface ReactionButtonsProps {
	articleId: string;
	slug: string;
	likesCount: number;
	userReaction?: "LIKE";
	isReadOnly?: boolean;
}

export function ReactionButtons({
	articleId,
	slug,
	likesCount,
	userReaction,
	isReadOnly = false,
}: ReactionButtonsProps) {
	const { react } = useArticleMutations();

	const isLiked = userReaction === "LIKE";
	const isPending = react.isPending;

	if (isReadOnly) {
		return (
			<div
				className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-zinc-500 select-none"
				aria-label="Likes count"
			>
				<Heart className="h-5 w-5" />
				<span className="text-sm font-semibold tabular-nums">{likesCount}</span>
			</div>
		);
	}

	return (
		<button
			type="button"
			disabled={isPending}
			onClick={() => react.mutate({ articleId, slug })}
			className={cn(
				"group flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border transition-all duration-200 select-none",
				"focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
				isLiked
					? "bg-primary/10 border-primary/30 text-primary dark:bg-primary/20 dark:border-primary/40 dark:text-primary"
					: "bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-primary/10 hover:border-primary/20 hover:text-primary dark:bg-zinc-900/50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-primary/15 dark:hover:border-primary/30 dark:hover:text-primary",
				isPending && "opacity-60 cursor-not-allowed",
			)}
			aria-label={isLiked ? "Unlike this article" : "Like this article"}
			aria-pressed={isLiked}
		>
			<Heart
				className={cn(
					"h-5 w-5 transition-transform duration-200",
					isLiked && "fill-current scale-110",
					!isLiked && "group-hover:scale-110",
				)}
			/>
			<span className="text-sm font-semibold tabular-nums">{likesCount}</span>
		</button>
	);
}

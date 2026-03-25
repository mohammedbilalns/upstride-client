import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useArticleMutations } from "../hooks/mutations";
import { cn } from "@/shared/utils/cn";

interface ReactionButtonsProps {
	articleId: string;
	slug: string;
	likesCount: number;
	dislikesCount: number;
	userReaction?: "LIKE" | "DISLIKE";
}

export function ReactionButtons({
	articleId,
	slug,
	likesCount,
	dislikesCount,
	userReaction,
}: ReactionButtonsProps) {
	const { react } = useArticleMutations();

	const handleReact = (reactionType: "LIKE" | "DISLIKE") => {
		react.mutate({ articleId, slug, reactionType });
	};

	const isPending = react.isPending;

	return (
		<div className="flex items-center gap-2">
			<Button
				variant="outline"
				size="sm"
				disabled={isPending}
				onClick={() => handleReact("LIKE")}
				className={cn(
					"rounded-full gap-2 transition-all",
					userReaction === "LIKE"
						? "bg-primary/20 border-primary text-primary hover:bg-primary/30"
						: "hover:bg-zinc-100 dark:hover:bg-zinc-800",
				)}
			>
				<ThumbsUp
					className={cn("h-4 w-4", userReaction === "LIKE" && "fill-current")}
				/>
				<span className="font-semibold">{likesCount}</span>
			</Button>

			<Button
				variant="outline"
				size="sm"
				disabled={isPending}
				onClick={() => handleReact("DISLIKE")}
				className={cn(
					"rounded-full gap-2 transition-all",
					userReaction === "DISLIKE"
						? "bg-red-500/20 border-red-500 text-red-500 hover:bg-red-500/30"
						: "hover:bg-zinc-100 dark:hover:bg-zinc-800",
				)}
			>
				<ThumbsDown
					className={cn(
						"h-4 w-4",
						userReaction === "DISLIKE" && "fill-current",
					)}
				/>
				<span className="font-semibold">{dislikesCount}</span>
			</Button>
		</div>
	);
}

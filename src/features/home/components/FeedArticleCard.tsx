import { Link } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import {
	Bookmark,
	Eye,
	Heart,
	MessageSquare,
	MoreHorizontal,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ArticleDto } from "@/features/article/types";

interface FeedArticleCardProps {
	article: ArticleDto;
}

export function FeedArticleCard({ article }: FeedArticleCardProps) {
	// Fallback stats since ArticleDto might not have these directly mapped in simplistic types
	const likes = article.likesCount ?? 0;
	const comments = article.commentsCount ?? 0;
	const views = article.views ?? 0;

	const formatNumber = (num: number) => {
		if (num >= 1000) {
			return (num / 1000).toFixed(1) + "k";
		}
		return num.toString();
	};

	return (
		<div className="rounded-xl border border-border bg-card p-6 flex flex-col space-y-4 transition-colors hover:border-zinc-300 dark:hover:border-zinc-700">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Avatar className="h-10 w-10">
						<AvatarImage src={article.authorSnapshot?.avatarUrl} />
						<AvatarFallback>
							{article.authorSnapshot?.name?.charAt(0) || "U"}
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col">
						<span className="text-sm font-semibold text-foreground">
							{article.authorSnapshot?.name}
						</span>
						<span className="text-xs text-muted-foreground">
							Expert <span className="mx-1">•</span>{" "}
							{formatDistanceToNow(new Date(article.createdAt), {
								addSuffix: true,
							})}
						</span>
					</div>
				</div>
				<button className="text-muted-foreground hover:text-foreground">
					<MoreHorizontal className="h-5 w-5" />
				</button>
			</div>

			{/* Content */}
			<div className="flex flex-col space-y-2">
				<Link
					to="/articles/$articleId"
					params={{ articleId: article.slug }}
					className="group"
				>
					<h3 className="text-xl font-bold leading-snug group-hover:text-primary transition-colors">
						{article.title}
					</h3>
				</Link>
				<p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
					{article.previewContent || article.description}
				</p>
			</div>

			{/* Footer Stats */}
			<div className="flex items-center justify-between pt-2">
				<div className="flex items-center gap-6 text-muted-foreground">
					<button className="flex items-center gap-2 hover:text-foreground transition-colors">
						<Heart className="h-4 w-4" />
						<span className="text-xs font-medium">{formatNumber(likes)}</span>
					</button>
					<button className="flex items-center gap-2 hover:text-foreground transition-colors">
						<MessageSquare className="h-4 w-4" />
						<span className="text-xs font-medium">
							{formatNumber(comments)}
						</span>
					</button>
					<button className="flex items-center hover:text-foreground transition-colors">
						<Bookmark className="h-4 w-4" />
					</button>
				</div>
				<div className="flex items-center gap-1.5 text-muted-foreground text-xs font-medium bg-muted/50 px-2 py-1 rounded-full">
					<Eye className="h-3.5 w-3.5" />
					{formatNumber(views)} views
				</div>
			</div>
		</div>
	);
}

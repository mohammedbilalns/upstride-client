import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Calendar, Eye, MessageSquare, Image as ImageIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { format } from "date-fns";
import type { ArticleDto } from "../types";

interface ArticleCardProps {
	article: ArticleDto;
}

export function ArticleCard({ article }: ArticleCardProps) {
	const [imageError, setImageError] = useState(false);

	return (
		<Card className="group flex flex-col h-full overflow-hidden bg-white dark:bg-zinc-950/50 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50 border-zinc-200/60 dark:border-zinc-800 transition-all duration-300">
			<div className="relative aspect-[16/10] overflow-hidden bg-zinc-100 dark:bg-zinc-900">
				{article.featuredImageUrl && !imageError ? (
					<img
						src={article.featuredImageUrl}
						alt={article.title}
						onError={() => {
							console.error(
								"Failed to load article image:",
								article.featuredImageUrl,
							);
							setImageError(true);
						}}
						className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
					/>
				) : (
					<div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 transition-transform duration-500 group-hover:scale-105">
						<ImageIcon
							className="w-10 h-10 mb-2 opacity-50"
							strokeWidth={1.5}
						/>
					</div>
				)}
				<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
					<div className="flex items-center gap-3 text-white text-xs font-medium">
						<div className="flex items-center gap-1">
							<Eye className="h-3.5 w-3.5" />
							{article.views}
						</div>
						<div className="flex items-center gap-1">
							<MessageSquare className="h-3.5 w-3.5" />
							{article.commentsCount}
						</div>
					</div>
				</div>
			</div>

			<CardHeader className="p-4 pb-2">
				<div className="flex items-center gap-2 mb-3">
					<Avatar className="h-6 w-6 border border-zinc-100 dark:border-zinc-800">
						<AvatarImage src={article.authorSnapshot.avatarUrl} />
						<AvatarFallback className="text-[10px]">
							{article.authorSnapshot.name.charAt(0)}
						</AvatarFallback>
					</Avatar>
					<span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
						{article.authorSnapshot.name}
					</span>
					<span className="text-[10px] text-zinc-400">•</span>
					<div className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium uppercase tracking-tight">
						<Calendar className="h-3 w-3" />
						{format(new Date(article.createdAt), "MMM d, yyyy")}
					</div>
				</div>
				<Link
					to="/articles/$articleId"
					params={{ articleId: article.slug }}
					className="block group-hover:text-primary transition-colors"
				>
					<h3 className="text-lg font-bold leading-tight text-zinc-900 dark:text-zinc-50 line-clamp-2 min-h-[3rem]">
						{article.title}
					</h3>
				</Link>
			</CardHeader>

			<CardContent className="px-4 py-0 flex-1">
				<p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
					{article.previewContent || article.description}
				</p>
			</CardContent>

			<CardFooter className="px-4 pb-4 pt-2 flex flex-col items-start gap-4">
				{article.tags && article.tags.length > 0 && (
					<div className="flex flex-wrap gap-1.5 w-full">
						{article.tags.slice(0, 3).map((tag) => (
							<Badge
								key={tag}
								variant="secondary"
								className="bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-[10px] font-medium border-none px-2.5 py-0.5 rounded-full"
							>
								#{tag}
							</Badge>
						))}
					</div>
				)}
				<Link
					to="/articles/$articleId"
					params={{ articleId: article.slug }}
					className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1 hover:gap-2 transition-all duration-300"
				>
					Read Article
					<span className="text-lg">→</span>
				</Link>
			</CardFooter>
		</Card>
	);
}

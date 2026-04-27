import { Link } from "@tanstack/react-router";
import { Calendar, Eye, Image as ImageIcon, MessageSquare } from "lucide-react";
import { useState } from "react";
import { ProgressiveImage } from "@/components/common/ProgressiveImage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/Card";
import { formatDateMedium } from "@/shared/utils/date";
import type { Article } from "../types";

interface ArticleCardProps {
	article: Article;
	isAdminView?: boolean;
}

export function ArticleCard({
	article,
	isAdminView = false,
}: ArticleCardProps) {
	const [imageError, setImageError] = useState(false);

	return (
		<Card className="group flex flex-col h-full overflow-hidden bg-transparent transition-colors duration-300">
			<div className="relative h-36 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
				{article.featuredImageUrl && !imageError ? (
					<ProgressiveImage
						src={article.featuredImageUrl}
						alt={article.title}
						onError={() => {
							console.error(
								"Failed to load article image:",
								article.featuredImageUrl,
							);
							setImageError(true);
						}}
						wrapperClassName="w-full h-full"
						className="object-cover w-full h-full"
					/>
				) : (
					<div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600">
						<ImageIcon className="w-8 h-8 opacity-40" strokeWidth={1.5} />
					</div>
				)}
				<div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
					<div className="flex items-center gap-2 text-white text-[10px] font-medium">
						<div className="flex items-center gap-1">
							<Eye className="h-3 w-3" />
							{article.views}
						</div>
						<div className="flex items-center gap-1">
							<MessageSquare className="h-3 w-3" />
							{article.commentsCount}
						</div>
					</div>
				</div>
			</div>

			<CardHeader className="px-4 pt-3 pb-1">
				<div className="flex items-center gap-1.5 mb-1.5">
					<Avatar className="h-5 w-5 border border-zinc-100 dark:border-zinc-800">
						<AvatarImage src={article.authorSnapshot.avatarUrl} />
						<AvatarFallback className="text-[9px]">
							{article.authorSnapshot.name.charAt(0)}
						</AvatarFallback>
					</Avatar>
					<span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
						{article.authorSnapshot.name}
					</span>
					<span className="text-[10px] text-zinc-400">•</span>
					<div className="flex items-center gap-1 text-[10px] text-zinc-400 font-medium uppercase tracking-tight">
						<Calendar className="h-2.5 w-2.5" />
						{formatDateMedium(article.createdAt)}
					</div>
				</div>
				<Link
					to={
						isAdminView ? "/admin-articles/$articleId" : "/articles/$articleId"
					}
					params={{ articleId: article.slug }}
					className="block group-hover:text-primary transition-colors"
				>
					<h3 className="text-sm font-semibold leading-snug text-zinc-900 dark:text-zinc-50 line-clamp-2">
						{article.title}
					</h3>
				</Link>
			</CardHeader>

			<CardContent className="px-4 py-0 flex-1">
				<p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
					{article.previewContent || article.description}
				</p>
			</CardContent>

			<CardFooter className="px-4 pb-3 pt-2 flex flex-col items-start gap-2">
				{article.tags && article.tags.length > 0 && (
					<div className="flex flex-wrap gap-1 w-full">
						{article.tags.slice(0, 3).map((tag) => (
							<Badge
								key={tag}
								variant="secondary"
								className="bg-zinc-100/80 dark:bg-zinc-800/60 text-zinc-500 dark:text-zinc-400 text-[10px] font-normal border border-zinc-200 dark:border-zinc-700/60 rounded-md px-1.5 py-0"
							>
								#{tag}
							</Badge>
						))}
					</div>
				)}
				<Link
					to={
						isAdminView ? "/admin-articles/$articleId" : "/articles/$articleId"
					}
					params={{ articleId: article.slug }}
					className="text-xs font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-1 hover:gap-1.5 hover:text-zinc-800 dark:hover:text-zinc-200 transition-all duration-200"
				>
					Read Article
					<span className="text-sm">→</span>
				</Link>
			</CardFooter>
		</Card>
	);
}

import { Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatDateShort } from "@/shared/utils/date";
import type { DashboardArticle } from "../types";
import { stripHtmlTags } from "../utils/dashboard.html";

interface RecommendedArticlesPanelProps {
	articles: DashboardArticle[];
}

export function RecommendedArticlesPanel({
	articles,
}: RecommendedArticlesPanelProps) {
	return (
		<Card className="gap-0 border-border/60 shadow-sm">
			<CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
				<div className="space-y-1">
					<CardTitle className="text-lg">Recommended For You</CardTitle>
					<p className="text-xs text-muted-foreground">
						Recent articles curated for your feed.
					</p>
				</div>
				<Link className="text-sm font-medium text-foreground" to="/articles">
					View all
				</Link>
			</CardHeader>
			<CardContent className="space-y-2.5">
				{articles.length === 0 ? (
					<div className="rounded-2xl border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
						No articles available.
					</div>
				) : (
					articles.map((article) => (
						<Link
							key={article.id}
							to="/articles/$articleId"
							params={{ articleId: article.slug }}
							className="group flex items-start gap-3 rounded-2xl border border-border/60 p-3 hover:border-primary/30"
						>
							<div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
								{article.featuredImageUrl ? (
									<img
										src={article.featuredImageUrl}
										alt={article.title}
										className="h-full w-full object-cover transition-transform group-hover:scale-105"
									/>
								) : (
									<FileText className="h-5 w-5 text-muted-foreground" />
								)}
							</div>
							<div className="min-w-0 flex-1">
								<p className="truncate text-sm font-medium group-hover:text-primary">
									{article.title}
								</p>
								<p className="line-clamp-2 text-xs text-muted-foreground">
									{stripHtmlTags(article.description)}
								</p>
								<p className="mt-1 text-[11px] text-muted-foreground">
									{formatDateShort(article.createdAt)} • {article.views} views
								</p>
							</div>
						</Link>
					))
				)}
			</CardContent>
		</Card>
	);
}

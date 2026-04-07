import { FileText } from "lucide-react";
import type { ArticleDto } from "@/features/article/types";
import { Link } from "@tanstack/react-router";

interface RecommendedArticlesWidgetProps {
	articles?: ArticleDto[];
}

export function RecommendedArticlesWidget({
	articles = [],
}: RecommendedArticlesWidgetProps) {
	return (
		<div className="rounded-xl bg-card border border-border p-6 flex flex-col space-y-4">
			<h3 className="font-semibold text-lg">Recommended Articles</h3>
			{articles.length === 0 ? (
				<div className="flex flex-col items-center justify-center text-center py-6 text-muted-foreground space-y-2">
					<FileText className="h-8 w-8 opacity-50" />
					<span className="text-sm">No articles available.</span>
				</div>
			) : (
				<div className="space-y-4">
					{articles.map((article) => (
						<Link
							to="/articles/$articleId"
							params={{ articleId: article.slug }}
							key={article.id}
							className="flex items-start gap-4 group"
						>
							<div className="h-14 w-14 rounded-md bg-muted flex items-center justify-center overflow-hidden shrink-0">
								{article.featuredImageUrl ? (
									<img
										src={article.featuredImageUrl}
										alt={article.title}
										className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
									/>
								) : (
									<FileText className="h-6 w-6 text-muted-foreground/50" />
								)}
							</div>
							<div className="flex flex-col space-y-1 overflow-hidden">
								<h4 className="text-sm font-medium truncate group-hover:text-primary transition-colors">
									{article.title}
								</h4>
								<span className="text-xs text-muted-foreground">
									{new Date(article.createdAt).toLocaleDateString(undefined, {
										month: "short",
										day: "numeric",
										year: "numeric",
									})}
								</span>
							</div>
						</Link>
					))}
				</div>
			)}
			{articles.length > 0 && (
				<Link
					to="/articles"
					search={{ page: 1 }}
					className="text-sm text-primary font-medium hover:underline pt-2 text-center"
				>
					View More
				</Link>
			)}
		</div>
	);
}

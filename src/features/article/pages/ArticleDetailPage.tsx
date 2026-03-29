import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProgressiveImage } from "@/components/common/ProgressiveImage";
import { articleQueries } from "../hooks/queries";
import { ArticleManagement } from "../components/ArticleManagement";
import { format } from "date-fns";
import { Link } from "@tanstack/react-router";
import { ReactionButtons } from "../components/ReactionButtons";
import { ReportDialog } from "@/components/common/ReportDialog";
import { CommentsSection } from "../components/CommentsSection";
import { useProfile } from "@/features/profile-management/hooks/use-profile";

export function ArticleDetailPage({
	articleId,
	isReadOnly = false,
}: {
	articleId: string;
	isReadOnly?: boolean;
}) {
	const { data: profile } = useProfile();
	const { data } = useQuery(articleQueries.detail(articleId));

	if (!data) return null;

	const { article, isAuthor, userReaction } = data;

	return (
		<div className="container mx-auto px-4 md:px-6 py-8 max-w-5xl">
			<div className="mb-4">
				<Button
					variant="ghost"
					size="sm"
					asChild
					className="text-primary hover:text-primary/90 hover:bg-primary/10 -ml-2"
				>
					{isReadOnly ? (
						<Link to="/report-management" search={{ page: 1, limit: 10 }}>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Reports
						</Link>
					) : (
						<Link to="/articles" search={{ page: 1 }}>
							<ArrowLeft className="h-4 w-4 mr-2" />
							Back to Articles
						</Link>
					)}
				</Button>
			</div>

			<article className="space-y-8">
				<div className="space-y-6">
					<div className="flex flex-wrap items-center justify-between gap-4">
						<div className="flex flex-wrap gap-2">
							{article.tags.map((tag) => (
								<Badge
									key={tag}
									variant="secondary"
									className="px-3 py-1 bg-primary/10 text-primary border-none"
								>
									{tag}
								</Badge>
							))}
						</div>
						<div className="flex items-center gap-2">
							{!isAuthor && !isReadOnly && (
								<ReportDialog targetId={article.id} targetType="ARTICLE" />
							)}
							<ArticleManagement
								articleId={article.id}
								slug={article.slug}
								isAuthor={!!isAuthor && !isReadOnly}
							/>
						</div>
					</div>

					<h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
						{article.title}
					</h1>

					<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
						<div className="flex items-center gap-4">
							<Avatar className="h-12 w-12 border-2 border-white dark:border-zinc-800 shadow-sm">
								<AvatarImage src={article.authorSnapshot.avatarUrl} />
								<AvatarFallback>
									{article.authorSnapshot.name.charAt(0)}
								</AvatarFallback>
							</Avatar>
							<div>
								<div className="font-bold text-zinc-900 dark:text-zinc-50">
									{article.authorSnapshot.name}
								</div>
								<div className="text-xs text-zinc-500 font-medium">
									Published on{" "}
									{format(new Date(article.createdAt), "MMMM d, yyyy")}
								</div>
							</div>
						</div>
						<div className="flex items-center gap-6">
							<div className="flex flex-col items-center sm:items-end">
								<span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
									Views
								</span>
								<span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
									<Eye className="h-4 w-4 text-zinc-400" />
									{article.views}
								</span>
							</div>
						</div>
					</div>
				</div>

				{article.featuredImageUrl && (
					<div className="relative aspect-[21/9] overflow-hidden rounded-3xl shadow-2xl">
						<ProgressiveImage
							src={article.featuredImageUrl}
							alt={article.title}
							wrapperClassName="w-full h-full"
							className="object-cover w-full h-full"
						/>
					</div>
				)}

				<div className="pt-8">
					<div
						className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-bold prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-p:leading-relaxed prose-p:text-lg"
						dangerouslySetInnerHTML={{ __html: article.description }}
					/>
				</div>

				<Separator className="my-12" />

				<div className="flex items-center justify-between py-6 border-b border-zinc-100 dark:border-zinc-800">
					<ReactionButtons
						articleId={article.id}
						slug={article.slug}
						likesCount={article.likesCount}
						userReaction={userReaction}
						isReadOnly={isReadOnly}
					/>
					<div className="text-sm text-zinc-500 font-medium">
						{article.commentsCount} Comments
					</div>
				</div>

				<div className="pt-8">
					<CommentsSection
						articleId={article.id}
						currentUserId={profile?.id}
						isReadOnly={isReadOnly}
					/>
				</div>
			</article>
		</div>
	);
}

import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { FileText, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArticleCard } from "../components/ArticleCard";
import { articleQueries } from "../hooks/queries";
import type { ArticleDto } from "../types";

export function MentorArticlesPage() {
	const navigate = useNavigate();
	const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
		useInfiniteQuery(articleQueries.mentorListInfinite());

	const items = data?.pages.flatMap((page) => page.items) ?? [];

	return (
		<div className="animate-in fade-in duration-500 space-y-6">
			{/* Header with Icon Pattern */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div className="flex items-center gap-2.5">
					<div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
						<FileText className="h-4.5 w-4.5" />
					</div>
					<div>
						<h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
							My Articles
						</h2>
						<p className="text-xs text-muted-foreground">
							Manage and track your published insights.
						</p>
					</div>
				</div>
				<Button
					onClick={() => navigate({ to: "/mentor/articles/create" })}
					className="rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-zinc-50 dark:text-zinc-900 shadow-lg shadow-zinc-900/10 font-bold px-5"
				>
					<Plus className="h-4 w-4 mr-2" />
					Create Article
				</Button>
			</div>

			<section>
				{isLoading ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="h-64 rounded-2xl bg-zinc-100 dark:bg-zinc-900/50 animate-pulse border border-zinc-200/50 dark:border-zinc-800/50"
							/>
						))}
					</div>
				) : (
					<>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
							{items.map((article: ArticleDto) => (
								<ArticleCard key={article.id} article={article} />
							))}
						</div>

						{items.length === 0 && (
							<div className="flex flex-col items-center justify-center py-20 text-center bg-white/40 dark:bg-zinc-950/20 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
								<div className="h-16 w-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-4 text-zinc-400">
									<FileText className="h-8 w-8" />
								</div>
								<h3 className="text-base font-medium text-zinc-800 dark:text-zinc-200 mb-1">
									No articles found
								</h3>
								<p className="text-sm text-zinc-500 max-w-xs">
									You haven't published any articles yet. Start sharing your
									expertise today!
								</p>
							</div>
						)}

						{hasNextPage && (
							<div className="mt-12 flex justify-center">
								<Button
									variant="outline"
									onClick={() => fetchNextPage()}
									disabled={isFetchingNextPage}
									className="rounded-xl px-12 h-11 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 transition-all font-bold"
								>
									{isFetchingNextPage ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Loading...
										</>
									) : (
										"View More"
									)}
								</Button>
							</div>
						)}
					</>
				)}
			</section>
		</div>
	);
}

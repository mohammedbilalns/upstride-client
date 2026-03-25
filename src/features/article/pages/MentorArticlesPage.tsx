import { useInfiniteQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { articleQueries } from "../hooks/queries";
import { ArticleCard } from "../components/ArticleCard";
import type { ArticleDto } from "../types";

export function MentorArticlesPage() {
	const navigate = useNavigate();
	const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
		useInfiniteQuery(articleQueries.mentorListInfinite());

	const items = data?.pages.flatMap((page) => page.items) ?? [];

	return (
		<div className="container mx-auto px-4 md:px-6 py-8 flex flex-col min-h-screen gap-6">
			<div className="flex items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
						My Articles
					</h1>
					<p className="text-sm text-zinc-500">
						Manage and track the performance of your published articles.
					</p>
				</div>
				<Button
					onClick={() => navigate({ to: "/mentor/articles/create" })}
					className="rounded-xl bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 shadow-lg"
				>
					<Plus className="h-4 w-4 mr-2" />
					Create Article
				</Button>
			</div>

			<section className="flex-1">
				{isLoading ? (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="h-64 rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse"
							/>
						))}
					</div>
				) : (
					<>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{items.map((article: ArticleDto) => (
								<ArticleCard key={article.id} article={article} />
							))}
						</div>

						{hasNextPage && (
							<div className="mt-12 flex justify-center">
								<Button
									variant="outline"
									onClick={() => fetchNextPage()}
									disabled={isFetchingNextPage}
									className="rounded-xl px-12 h-11"
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

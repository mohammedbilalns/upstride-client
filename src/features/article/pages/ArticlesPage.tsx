import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Plus, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { ArticleCard } from "../components/ArticleCard";
import { ArticleFilters } from "../components/ArticleFilters";
import { articleQueries } from "../hooks/queries";
import { getMentorCategoriesQueryOptions } from "@/features/mentor-discovery/hooks/queries";
import { Route } from "@/routes/_user-layout/articles/index";
import type { ArticleDto } from "../types";

export function ArticlesPage() {
	const navigate = useNavigate({ from: Route.fullPath });
	const search = Route.useSearch();
	const [searchInput, setSearchInput] = useState(search.search ?? "");
	const debouncedSearch = useDebounce(searchInput, 400);

	const { auth } = Route.useRouteContext();
	const isMentor = auth.user?.role === "MENTOR";

	const updateSearch = (updates: any) => {
		navigate({
			search: (prev: any) => ({
				...prev,
				...updates,
			}),
		});
	};

	useEffect(() => {
		if ((search.search ?? "") !== debouncedSearch) {
			updateSearch({ search: debouncedSearch || undefined });
		}
	}, [debouncedSearch]);

	const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
		useInfiniteQuery(
			articleQueries.listInfinite({
				search: search.search,
				skill: search.skill,
				category: search.category,
			}),
		);

	const items = data?.pages.flatMap((page) => page.items) ?? [];

	const { data: categories = [] } = useQuery(getMentorCategoriesQueryOptions());
	const { data: topTagsData, isLoading: isLoadingTags } = useQuery(
		articleQueries.topTags(),
	);

	return (
		<div className="container mx-auto px-4 md:px-6 py-8 flex flex-col min-h-screen gap-6 relative">
			<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
				<div className="flex flex-col gap-1">
					<h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
						Articles & Insights
					</h1>
					<p className="text-lg text-zinc-500 max-w-2xl">
						Explore expert perspectives and stay updated with the latest in tech
						and career.
					</p>
				</div>
				{isMentor && (
					<Button
						onClick={() => navigate({ to: "/mentor/articles/create" })}
						className="rounded-xl bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 shadow-lg shadow-zinc-200 dark:shadow-none"
					>
						<Plus className="h-4 w-4 mr-2" />
						Create Article
					</Button>
				)}
			</div>

			<div className="flex flex-col lg:flex-row gap-8 flex-1">
				<aside className="lg:w-[320px] shrink-0 space-y-6">
					<div className="rounded-2xl border border-zinc-200/70 bg-white/70 backdrop-blur-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950/40 p-5 space-y-4">
						<p className="text-xs font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">
							Search
						</p>
						<div className="relative">
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
							<Input
								placeholder="Search articles..."
								className="h-11 pl-11 rounded-xl bg-white/60 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800 focus:ring-primary/20"
								value={searchInput}
								onChange={(e) => setSearchInput(e.target.value)}
							/>
						</div>
					</div>

					<ArticleFilters
						search={search}
						categories={categories}
						isLoadingCategories={false}
						topTags={topTagsData?.tags}
						isLoadingTags={isLoadingTags}
						onUpdate={updateSearch}
						onClear={() =>
							navigate({
								search: {
									page: 1,
									search: undefined,
									skill: undefined,
									category: undefined,
								},
							})
						}
					/>
				</aside>

				<section className="flex-1 min-w-0">
					{isLoading ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
							{[1, 2, 3, 4, 5, 6].map((i) => (
								<div
									key={i}
									className="h-[400px] rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse"
								/>
							))}
						</div>
					) : items.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-20 text-center">
							<div className="h-20 w-20 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-6">
								<Search className="h-10 w-10 text-zinc-300" />
							</div>
							<h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200 mb-2">
								No articles found
							</h3>
							<p className="text-sm text-zinc-500 max-w-xs">
								We couldn't find any articles matching your current filters. Try
								adjusting your search.
							</p>
						</div>
					) : (
						<>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
								{items.map((article: ArticleDto) => (
									<ArticleCard key={article.id} article={article} />
								))}
							</div>

							{hasNextPage && (
								<div className="mt-12 flex justify-center">
									<Button
										variant="outline"
										size="lg"
										onClick={() => fetchNextPage()}
										disabled={isFetchingNextPage}
										className="rounded-xl px-12 h-12 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
									>
										{isFetchingNextPage ? (
											<>
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
												Loading...
											</>
										) : (
											"View More Articles"
										)}
									</Button>
								</div>
							)}
						</>
					)}
				</section>
			</div>
		</div>
	);
}

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Plus, Search, Newspaper } from "lucide-react";
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
	const total = data?.pages[0]?.total ?? 0;

	const { data: categories = [] } = useQuery(getMentorCategoriesQueryOptions());
	const { data: topTagsData, isLoading: isLoadingTags } = useQuery(
		articleQueries.topTags(),
	);

	return (
		<div className="relative">
			<div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-zinc-50 to-transparent dark:from-zinc-950 dark:to-transparent" />
			<div className="container mx-auto px-4 md:px-6 py-8 flex flex-col min-h-screen gap-6 relative">
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
					<div className="flex flex-col gap-1">
						<h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
							Articles & Insights
						</h1>
						<p className="text-sm text-muted-foreground">
							Explore expert perspectives and stay updated with the latest in
							tech and career.
						</p>
					</div>
					{isMentor && (
						<Button
							onClick={() => navigate({ to: "/mentor/articles/create" })}
							className="rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
						>
							<Plus className="h-4 w-4 mr-2" />
							Create Article
						</Button>
					)}
				</div>

				<div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
					<aside className="lg:w-[300px] shrink-0">
						<div className="lg:sticky top-6 space-y-4">
							<div className="rounded-2xl border border-zinc-200/70 bg-white/70 backdrop-blur-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950/40 p-4 space-y-3">
								<p className="text-xs font-semibold tracking-widest text-zinc-500 dark:text-zinc-400">
									SEARCH
								</p>
								<div className="relative">
									<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
									<Input
										placeholder="Search articles..."
										className="h-11 pl-11 rounded-xl bg-white/60 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary/20 hover:bg-white/80 dark:hover:bg-zinc-900/60"
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
						</div>
					</aside>

					<section className="flex-1 min-w-0 min-h-0">
						<div className="rounded-2xl border border-zinc-200/70 bg-white/70 backdrop-blur-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950/40 px-4 py-3">
							<div>
								<p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
									Article results
								</p>
								{items.length > 0 && !isLoading && (
									<p className="text-xs text-zinc-500">
										Showing{" "}
										<span className="font-medium text-zinc-700 dark:text-zinc-300">
											{items.length}
										</span>{" "}
										of{" "}
										<span className="font-medium text-zinc-700 dark:text-zinc-300">
											{total}
										</span>{" "}
										articles
									</p>
								)}
							</div>
						</div>

						<div className="mt-4 min-w-0 min-h-0 space-y-6">
							{isLoading && (
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
									{Array.from({ length: 9 }).map((_, i) => (
										<div
											key={i}
											className="h-72 rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse"
										/>
									))}
								</div>
							)}

							{!isLoading && items.length === 0 && (
								<div className="flex flex-col items-center justify-center py-20 text-center">
									<div className="h-16 w-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-4">
										<Newspaper className="h-8 w-8 text-zinc-400" />
									</div>
									<h3 className="text-base font-medium text-zinc-800 dark:text-zinc-200 mb-1">
										No articles found
									</h3>
									<p className="text-sm text-zinc-500">
										Try adjusting your filters to discover amazing insights.
									</p>
								</div>
							)}

							{!isLoading && items.length > 0 && (
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
									{items.map((article: ArticleDto) => (
										<ArticleCard key={article.id} article={article} />
									))}
								</div>
							)}

							{hasNextPage && (
								<div className="flex justify-center pt-4 pb-8">
									<Button
										variant="outline"
										size="sm"
										onClick={() => fetchNextPage()}
										disabled={isFetchingNextPage}
										className="rounded-xl px-12 border-primary/30 text-primary hover:bg-primary/10 dark:border-primary/40 dark:hover:bg-primary/20 transition-colors"
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
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}

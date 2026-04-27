import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Newspaper, Plus, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getMentorCategoriesQueryOptions } from "@/features/mentor-discovery/hooks/queries/useMentorDiscoveryQueries";
import { Route } from "@/routes/_app-layout/_user-layout/articles/index";
import { ArticleCard } from "../components/ArticleCard";
import { ArticleFilters } from "../components/ArticleFilters";
import { articleInfiniteQueries, articleQueries } from "../hooks/queries";
import type { Article } from "../types";
import type { ArticleSearch } from "../validators/article-search-params.schema";

export function ArticlesPage() {
	const navigate = useNavigate({ from: Route.fullPath });
	const search = Route.useSearch();

	const [inputValue, setInputValue] = useState(search.search ?? "");

	const lastPushedRef = useRef(search.search ?? "");
	const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

	const { auth } = Route.useRouteContext();
	const isMentor = auth.user?.role === "MENTOR";

	const updateSearch = useCallback(
		(updates: Partial<ArticleSearch>) => {
			navigate({
				search: (prev: ArticleSearch) => ({
					...prev,
					...updates,
				}),
			});
		},
		[navigate],
	);

	const skeletonKeys = useMemo(
		() => Array.from({ length: 9 }, (_unused, index) => `skeleton-${index}`),
		[],
	);

	useEffect(() => {
		const urlValue = search.search ?? "";
		if (urlValue !== lastPushedRef.current) {
			setInputValue(urlValue);
			lastPushedRef.current = urlValue;
		}
	}, [search.search]);

	function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
		const value = e.target.value;
		setInputValue(value);
		clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => {
			lastPushedRef.current = value;
			navigate({
				search: (prev: ArticleSearch) => ({
					...prev,
					search: value || undefined,
				}),
			});
		}, 400);
	}

	const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
		useInfiniteQuery(
			articleInfiniteQueries.list({
				search: search.search,
				tag: search.tag,
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
			<div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-zinc-50 to-transparent dark:from-zinc-950 dark:to-transparent" />
			<div className="container mx-auto px-4 md:px-6 py-8 flex flex-col min-h-screen gap-6 relative">
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
					<div className="flex flex-col gap-1">
						<h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
							Articles & Insights
						</h1>
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
					<aside className="lg:w-75 shrink-0">
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
										value={inputValue}
										onChange={handleSearchInput}
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
											search: undefined,
											tag: undefined,
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
									{skeletonKeys.map((key) => (
										<div
											key={key}
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
									{items.map((article: Article) => (
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

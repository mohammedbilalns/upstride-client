import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { GraduationCap, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Route } from "@/routes/_user-layout/mentors";
import { useDebounce } from "@/shared/hooks/use-debounce";
import {
	getMentorCategoriesQueryOptions,
	getMentorsInfiniteQueryOptions,
} from "../hooks/queries";
import type { MentorDiscoverySearch } from "../validators/mentor-discovery-params";
import { MentorCard } from "../components/MentorCard";
import { MentorFilters } from "../components/MentorFilters";

export function MentorDiscoveryPage() {
	const navigate = useNavigate({ from: Route.fullPath });
	const search = Route.useSearch();
	const [searchInput, setSearchInput] = useState(search.search ?? "");
	const debouncedSearch = useDebounce(searchInput, 400);

	const updateSearch = (updates: Partial<MentorDiscoverySearch>) => {
		navigate({
			search: (prev) => ({
				...prev,
				...updates,
			}),
		});
	};

	const clearFilters = () => {
		navigate({
			search: {
				sort: "rating",
			},
		});
	};

	useEffect(() => {
		setSearchInput(search.search ?? "");
	}, [search.search]);

	useEffect(() => {
		if ((search.search ?? "") !== debouncedSearch) {
			updateSearch({ search: debouncedSearch || undefined });
		}
	}, [debouncedSearch, search.search]);

	const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
		useInfiniteQuery(
			getMentorsInfiniteQueryOptions({
				search: search.search,
				categoryId: search.categoryId,
				tierId: search.tierId,
				minExperience: search.minExperience,
				maxExperience: search.maxExperience,
				sort: search.sort,
			}),
		);

	const categoriesQuery = useQuery(getMentorCategoriesQueryOptions());

	const pages = data?.pages ?? [];
	const items = pages.flatMap((page) => page.items);
	const total = pages[0]?.total ?? 0;

	return (
		<div className="relative">
			<div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-zinc-50 to-transparent dark:from-zinc-950 dark:to-transparent" />
			<div className="container mx-auto px-6 py-8 flex flex-col min-h-screen gap-6 relative">
				<div className="flex flex-col gap-1">
					<h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
						Discover Mentors
					</h1>
					<p className="text-sm text-zinc-500 dark:text-zinc-400">
						Browse and connect with experienced mentors in your areas of
						interest.
					</p>
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
										id="mentor-search"
										placeholder="Search by name"
										className="h-11 pl-11 rounded-xl bg-white/60 dark:bg-zinc-950/40"
										value={searchInput}
										onChange={(e) => setSearchInput(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												updateSearch({ search: searchInput || undefined });
											}
										}}
									/>
								</div>
							</div>

							<MentorFilters
								search={search}
								categories={categoriesQuery.data ?? []}
								isLoadingCategories={categoriesQuery.isLoading}
								onUpdate={updateSearch}
								onClear={clearFilters}
							/>
						</div>
					</aside>

					<section className="flex-1 min-w-0 min-h-0">
						<div className="rounded-2xl border border-zinc-200/70 bg-white/70 backdrop-blur-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950/40 px-4 py-3">
							<div>
								<p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
									Mentor results
								</p>
								{pages.length > 0 && !isLoading && (
									<p className="text-xs text-zinc-500">
										Showing{" "}
										<span className="font-medium text-zinc-700 dark:text-zinc-300">
											{items.length}
										</span>{" "}
										of{" "}
										<span className="font-medium text-zinc-700 dark:text-zinc-300">
											{total}
										</span>{" "}
										mentors
									</p>
								)}
							</div>
						</div>

						<div className="mt-4 min-w-0 min-h-0 space-y-6 overflow-y-auto pr-2 lg:h-[calc(100vh-260px)]">
							{isLoading && (
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
									{Array.from({ length: 12 }).map((_, i) => (
										<div
											// biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
											key={i}
											className="h-72 rounded-lg bg-zinc-100 dark:bg-zinc-900 animate-pulse"
										/>
									))}
								</div>
							)}

							{!isLoading && items.length === 0 && (
								<div className="flex flex-col items-center justify-center py-20 text-center">
									<div className="h-16 w-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-4">
										<GraduationCap className="h-8 w-8 text-zinc-400" />
									</div>
									<h3 className="text-base font-medium text-zinc-800 dark:text-zinc-200 mb-1">
										No mentors found
									</h3>
									<p className="text-sm text-zinc-500">
										Try adjusting your search filters to find available mentors.
									</p>
								</div>
							)}

							{!isLoading && items.length > 0 && (
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
									{items.map((mentor) => (
										<MentorCard key={mentor.id} mentor={mentor} />
									))}
								</div>
							)}

							{hasNextPage && (
								<div className="flex justify-center pt-4">
									<Button
										variant="outline"
										size="sm"
										disabled={isFetchingNextPage}
										onClick={() => fetchNextPage()}
									>
										{isFetchingNextPage ? "Loading..." : "View More"}
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

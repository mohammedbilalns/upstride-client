import { Button } from "@/components/ui/button";
import { useInfiniteQuery } from "@tanstack/react-query";
import { GraduationCap } from "lucide-react";
import { getMentorsInfiniteQueryOptions } from "../queries";
import type { MentorDiscoverySearch } from "../validators/mentor-discovery-params";
import { MentorCard } from "../components/MentorCard";
import { MentorFilters } from "../components/MentorFilters";

interface MentorDiscoveryPageProps {
	search: MentorDiscoverySearch;
	searchInput: string;
	onSearchInputChange: (value: string) => void;
	onUpdate: (updates: Partial<MentorDiscoverySearch>) => void;
	onClear: () => void;
}

export function MentorDiscoveryPage({
	search,
	searchInput,
	onSearchInputChange,
	onUpdate,
	onClear,
}: MentorDiscoveryPageProps) {
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

	const pages = data?.pages ?? [];
	const items = pages.flatMap((page) => page.items);
	const total = pages[0]?.total ?? 0;

	return (
		<div className="container mx-auto px-6 py-8 space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
					Discover Mentors
				</h1>
				<p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
					Browse and connect with experienced mentors in your areas of interest.
				</p>
			</div>

			{/* Filters */}
			<MentorFilters
				search={search}
				searchInput={searchInput}
				onSearchInputChange={onSearchInputChange}
				onUpdate={onUpdate}
				onClear={onClear}
			/>

			{/* Results summary */}
			{pages.length > 0 && !isLoading && (
				<p className="text-sm text-zinc-500">
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

			{/* Loading skeleton */}
			{isLoading && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{Array.from({ length: 12 }).map((_, i) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
							key={i}
							className="h-72 rounded-lg bg-zinc-100 dark:bg-zinc-900 animate-pulse"
						/>
					))}
				</div>
			)}

			{/* Empty State */}
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

			{/* Cards Grid */}
			{!isLoading && items.length > 0 && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
					{items.map((mentor) => (
						<MentorCard key={mentor.id} mentor={mentor} />
					))}
				</div>
			)}

			{/* View More */}
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
	);
}

import { createFileRoute } from "@tanstack/react-router";
import { getMentorsInfiniteQueryOptions } from "@/features/mentor-discovery/queries";
import { MentorDiscoveryPage } from "@/features/mentor-discovery/pages/MentorDiscoveryPage";
import { MentorDiscoverySearchSchema } from "@/features/mentor-discovery/validators/mentor-discovery-params";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_user-layout/mentors")({
	validateSearch: (search) => MentorDiscoverySearchSchema.parse(search),
	loaderDeps: ({ search }) => ({ search }),
	loader: async ({ context: { queryClient }, deps: { search } }) => {
		await queryClient.ensureInfiniteQueryData(
			getMentorsInfiniteQueryOptions({
				search: search.search,
				categoryId: search.categoryId,
				tierId: search.tierId,
				minExperience: search.minExperience,
				maxExperience: search.maxExperience,
				sort: search.sort,
			}),
		);
	},
	component: Component,
});

function Component() {
	const navigate = Route.useNavigate();
	const search = Route.useSearch();
	const [searchInput, setSearchInput] = useState(search.search ?? "");
	const debouncedSearch = useDebounce(searchInput, 400);

	const updateSearch = (updates: Partial<typeof search>) => {
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

	return (
		<MentorDiscoveryPage
			search={search}
			searchInput={searchInput}
			onSearchInputChange={setSearchInput}
			onUpdate={updateSearch}
			onClear={clearFilters}
		/>
	);
}

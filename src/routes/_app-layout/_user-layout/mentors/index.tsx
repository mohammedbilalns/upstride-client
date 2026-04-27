import { createFileRoute } from "@tanstack/react-router";
import { getMentorsInfiniteQueryOptions } from "@/features/mentor-discovery/hooks/queries/useMentorDiscoveryQueries";
import { MentorDiscoveryPage } from "@/features/mentor-discovery/pages/MentorDiscoveryPage";
import { MentorDiscoverySearchSchema } from "@/features/mentor-discovery/validators/mentor-discovery-params.schema";

export const Route = createFileRoute("/_app-layout/_user-layout/mentors/")({
	validateSearch: (search) => MentorDiscoverySearchSchema.parse(search),
	loaderDeps: ({ search }) => ({ search }),
	loader: async ({ context: { queryClient }, deps: { search } }) => {
		await queryClient.ensureInfiniteQueryData(
			getMentorsInfiniteQueryOptions({
				search: search.search,
				category: search.category,
				tierId: search.tierId,
				minExperience: search.minExperience,
				maxExperience: search.maxExperience,
				sort: search.sort,
			}),
		);
	},
	component: MentorDiscoveryPage,
});

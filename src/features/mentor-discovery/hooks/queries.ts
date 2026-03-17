import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { mentorDiscoveryService } from "../services/mentor-discovery.service";
import type { GetMentorsDiscoveryInput } from "../types";

const CATEGORY_CACHE_TIME_MS = 7 * 60 * 1000;

export const mentorDiscoveryKeys = {
	all: ["mentor-discovery"] as const,
	lists: () => [...mentorDiscoveryKeys.all, "list"] as const,
	list: (filters: string) =>
		[...mentorDiscoveryKeys.lists(), { filters }] as const,
	categories: () => [...mentorDiscoveryKeys.all, "categories"] as const,
};

export const getMentorsInfiniteQueryOptions = (
	params: Omit<GetMentorsDiscoveryInput, "page">,
) => {
	return infiniteQueryOptions({
		queryKey: mentorDiscoveryKeys.list(JSON.stringify(params)),
		queryFn: ({ pageParam }) =>
			mentorDiscoveryService.getMentors({
				...params,
				page: pageParam as number,
			}),
		initialPageParam: 1,
		getNextPageParam: (lastPage) =>
			lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
	});
};

export const getMentorCategoriesQueryOptions = () =>
	queryOptions({
		queryKey: mentorDiscoveryKeys.categories(),
		queryFn: () => mentorDiscoveryService.getCategories(),
		staleTime: CATEGORY_CACHE_TIME_MS,
		gcTime: CATEGORY_CACHE_TIME_MS,
	});

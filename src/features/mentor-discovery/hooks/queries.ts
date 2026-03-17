import { infiniteQueryOptions } from "@tanstack/react-query";
import { mentorDiscoveryService } from "../services/mentor-discovery.service";
import type { GetMentorsDiscoveryInput } from "../types";

export const mentorDiscoveryKeys = {
	all: ["mentor-discovery"] as const,
	lists: () => [...mentorDiscoveryKeys.all, "list"] as const,
	list: (filters: string) =>
		[...mentorDiscoveryKeys.lists(), { filters }] as const,
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

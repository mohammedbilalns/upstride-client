import type { QueryKey, useQueryClient } from "@tanstack/react-query";

export function updateQueryCache<T>(
	queryClient: ReturnType<typeof useQueryClient>,
	queryKey: QueryKey,
	updater: (data: T) => T,
) {
	queryClient.setQueriesData<T>({ queryKey }, (oldData) => {
		if (!oldData) return oldData;
		return updater(oldData);
	});
}

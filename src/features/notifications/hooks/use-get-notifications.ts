import { useInfiniteQuery } from "@tanstack/react-query";
import { notificationService } from "../services/notification.service";
import type { GetNotificationsInput } from "../types";

export const NOTIFICATIONS_QUERY_KEY = ["notifications"];

export const useGetNotifications = (params: GetNotificationsInput = {}) => {
	return useInfiniteQuery({
		queryKey: [...NOTIFICATIONS_QUERY_KEY, params],
		queryFn: ({ pageParam = 1 }) =>
			notificationService.getNotifications({ ...params, page: pageParam }),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => {
			if (lastPage.page < lastPage.totalPages) {
				return lastPage.page + 1;
			}
			return undefined;
		},
	});
};

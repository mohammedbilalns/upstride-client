import { useQuery } from "@tanstack/react-query";
import { notificationService } from "../services/notification.service";
import { NOTIFICATIONS_QUERY_KEY } from "./use-get-notifications";

export const UNREAD_COUNT_QUERY_KEY = [
	...NOTIFICATIONS_QUERY_KEY,
	"unread-count",
];

export const useGetUnreadCount = () => {
	return useQuery({
		queryKey: UNREAD_COUNT_QUERY_KEY,
		queryFn: () => notificationService.getUnreadCount(),
	});
};

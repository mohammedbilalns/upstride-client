import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../../services/notification.service";
import { NOTIFICATIONS_QUERY_KEY } from "../queries/useGetNotifications";
import { UNREAD_COUNT_QUERY_KEY } from "../queries/useGetUnreadCount";

export const useMarkAllNotificationsRead = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => notificationService.markAllRead(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_QUERY_KEY });
		},
	});
};

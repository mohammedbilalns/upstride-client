import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../../services/notification.service";
import type { GetUnreadNotificationCountOutput } from "../../types";
import { NOTIFICATIONS_QUERY_KEY } from "../queries/useGetNotifications";

export const useMarkAllNotificationsRead = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => notificationService.markAllRead(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
			queryClient.setQueryData<GetUnreadNotificationCountOutput>(
				["notifications", "unread-count"],
				(old) => {
					if (!old) return old;
					return { count: 0 };
				},
			);
		},
	});
};

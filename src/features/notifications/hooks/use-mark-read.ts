import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../services/notification.service";
import { NOTIFICATIONS_QUERY_KEY } from "./use-get-notifications";
import { UNREAD_COUNT_QUERY_KEY } from "./use-get-unread-count";

export const useMarkNotificationRead = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (notificationId: string) =>
			notificationService.markRead(notificationId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY });
			queryClient.invalidateQueries({ queryKey: UNREAD_COUNT_QUERY_KEY });
		},
	});
};

import { useQuery } from "@tanstack/react-query";
import { notificationService } from "../services/notification.service";
import type { GetNotificationsInput } from "../types";

export const NOTIFICATIONS_QUERY_KEY = ["notifications"];

export const useGetNotifications = (params: GetNotificationsInput = {}) => {
	return useQuery({
		queryKey: [...NOTIFICATIONS_QUERY_KEY, params],
		queryFn: () => notificationService.getNotifications(params),
	});
};

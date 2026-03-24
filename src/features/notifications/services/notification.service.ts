import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	GetNotificationsInput,
	GetNotificationsOutput,
	GetUnreadNotificationCountOutput,
	MarkAllNotificationsReadOutput,
	MarkNotificationReadOutput,
} from "../types";

export const notificationService = {
	getNotifications: async (
		params: GetNotificationsInput = {},
	): Promise<GetNotificationsOutput> => {
		const response = await api.get<{ data: GetNotificationsOutput }>(
			`${ROUTES.NOTIFICATIONS.BASE}${ROUTES.NOTIFICATIONS.ROOT}`,
			{ params },
		);
		return response.data.data;
	},
	markRead: async (
		notificationId: string,
	): Promise<MarkNotificationReadOutput> => {
		const response = await api.patch<{ data: MarkNotificationReadOutput }>(
			`${ROUTES.NOTIFICATIONS.BASE}${ROUTES.NOTIFICATIONS.MARK_READ(
				notificationId,
			)}`,
		);
		return response.data.data;
	},
	markAllRead: async (): Promise<MarkAllNotificationsReadOutput> => {
		const response = await api.patch<{ data: MarkAllNotificationsReadOutput }>(
			`${ROUTES.NOTIFICATIONS.BASE}${ROUTES.NOTIFICATIONS.READ_ALL}`,
		);
		return response.data.data;
	},
	getUnreadCount: async (): Promise<GetUnreadNotificationCountOutput> => {
		const response = await api.get<{
			data: GetUnreadNotificationCountOutput;
		}>(`${ROUTES.NOTIFICATIONS.BASE}${ROUTES.NOTIFICATIONS.UNREAD_COUNT}`);
		return response.data.data;
	},
};

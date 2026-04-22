import type { ApiSuccess } from "@/api/apiSuccess";
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
	getNotifications: async (params: GetNotificationsInput = {}) => {
		const response = await api.get<ApiSuccess<GetNotificationsOutput>>(
			`${ROUTES.NOTIFICATIONS.BASE}${ROUTES.NOTIFICATIONS.ROOT}`,
			{ params },
		);
		return response.data.data;
	},
	markRead: async (notificationId: string) => {
		const response = await api.patch<ApiSuccess<MarkNotificationReadOutput>>(
			`${ROUTES.NOTIFICATIONS.BASE}${ROUTES.NOTIFICATIONS.MARK_READ(
				notificationId,
			)}`,
		);
		return response.data.data;
	},
	markAllRead: async () => {
		const response = await api.patch<
			ApiSuccess<MarkAllNotificationsReadOutput>
		>(`${ROUTES.NOTIFICATIONS.BASE}${ROUTES.NOTIFICATIONS.READ_ALL}`);
		return response.data.data;
	},
	getUnreadCount: async () => {
		const response = await api.get<
			ApiSuccess<GetUnreadNotificationCountOutput>
		>(`${ROUTES.NOTIFICATIONS.BASE}${ROUTES.NOTIFICATIONS.UNREAD_COUNT}`);
		return response.data.data;
	},
};

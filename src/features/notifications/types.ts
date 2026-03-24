export type NotificationType =
	| "CHAT"
	| "ARTICLE"
	| "SESSION"
	| "PAYMENT"
	| "REPORT"
	| "SYSTEM";

export type NotificationEvent =
	| "MESSAGE_RECEIVED"
	| "SESSION_BOOKED"
	| "ARTICLE_LIKED"
	| "PAYMENT_SUCCESS";

export interface NotificationDto {
	id: string;
	userId: string;
	title: string;
	description: string;
	type: NotificationType;
	event: NotificationEvent;
	isRead: boolean;
	readAt?: string;
	metadata?: Record<string, unknown>;
	deliveryStatus?: {
		inApp: boolean;
		push?: boolean;
		email?: boolean;
	};
	actorId?: string;
	relatedEntityId?: string;
	createdAt: string;
	updatedAt?: string;
}

export type NotificationReadFilter = "read" | "unread" | "all";

export interface GetNotificationsInput {
	page?: number;
	status?: NotificationReadFilter;
}

export interface GetNotificationsOutput {
	notifications: NotificationDto[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface MarkNotificationReadOutput {
	notification: NotificationDto;
}

export interface MarkAllNotificationsReadOutput {
	updatedCount: number;
}

export interface GetUnreadNotificationCountOutput {
	count: number;
}

export type MessageType = "TEXT" | "IMAGE" | "FILE";
export type MessageStatus = "send" | "read";

export interface ChatDto {
	id: string;
	user1Id: string;
	user2Id: string;
	lastMessageId: string | null;
	unreadCount: Record<string, number>;
	createdAt: string;
	updatedAt: string;
}

export interface ChatMessageDto {
	id: string;
	chatId: string;
	senderId: string;
	messageType: MessageType;
	content: string | null;
	attachementId: string | null;
	repliedTo: string | null;
	status: MessageStatus;
	createdAt: string;
	updatedAt: string;
}

export type ChatReadFilter = "read" | "unread" | "all";

export interface GetChatsInput {
	page?: number;
	filter?: ChatReadFilter;
}

export interface GetChatsOutput {
	chats: ChatDto[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface GetChatOutput {
	chat: ChatDto;
}

export interface SendMessageInput {
	content?: string | null;
	mediaId?: string | null;
	repliedTo?: string | null;
}

export interface SendMessageOutput {
	message: ChatMessageDto;
}

export interface MarkMessagesReadOutput {
	updatedCount: number;
}

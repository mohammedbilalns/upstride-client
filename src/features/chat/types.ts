export type MessageType = "TEXT" | "IMAGE" | "FILE";
export type MessageStatus = "sending" | "send" | "read";

export interface Chat {
	id: string;
	senderId: string;
	receiverId: string;
	sender: ChatUser;
	receiver: ChatUser;
	lastMessageId: string | null;
	lastMessage: ChatLastMessage | null;
	unreadCount: Record<string, number>;
	createdAt: string;
	updatedAt: string;
}

export interface ChatUser {
	id: string;
	name: string;
	profilePictureUrl?: string | null;
	role?: "USER" | "MENTOR" | "ADMIN" | "SUPER_ADMIN";
}

export interface ChatLastMessage {
	id: string;
	senderId: string;
	messageType: "TEXT" | "IMAGE" | "FILE";
	content: string | null;
	mediaId: string | null;
	createdAt: string;
}

export interface ChatMessage {
	id: string;
	chatId: string;
	senderId: string;
	messageType: MessageType;
	content: string | null;
	attachementId: string | null;
	mediaUrl: string | null;
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
	chats: Chat[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface GetChatInput {
	page?: number;
}

export interface GetChatOutput {
	chat: Chat | null;
	receiver: ChatUser | null;
	messages: ChatMessage[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface SendMessageInput {
	content?: string | null;
	mediaId?: string | null;
	messageType?: "TEXT" | "IMAGE" | "FILE";
	repliedTo?: string | null;
	senderId?: string;
}

export interface SendMessageOutput {
	message: ChatMessage;
}

export interface MarkMessagesReadOutput {
	updatedCount: number;
}

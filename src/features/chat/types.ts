export type MessageType = "TEXT" | "IMAGE" | "FILE";
export type MessageStatus = "sending" | "send" | "read";

export interface ChatDto {
	id: string;
	senderId: string;
	receiverId: string;
	sender: ChatUserDto;
	receiver: ChatUserDto;
	lastMessageId: string | null;
	lastMessage: ChatLastMessageDto | null;
	unreadCount: Record<string, number>;
	createdAt: string;
	updatedAt: string;
}

export interface ChatUserDto {
	id: string;
	name: string;
	profilePictureUrl?: string | null;
}

export interface ChatLastMessageDto {
	id: string;
	senderId: string;
	messageType: "TEXT" | "IMAGE" | "FILE";
	content: string | null;
	mediaId: string | null;
	createdAt: string;
}

export interface ChatMessageDto {
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
	chats: ChatDto[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface GetChatInput {
	page?: number;
}

export interface GetChatOutput {
	chat: ChatDto | null;
	messages: ChatMessageDto[];
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
	message: ChatMessageDto;
}

export interface MarkMessagesReadOutput {
	updatedCount: number;
}

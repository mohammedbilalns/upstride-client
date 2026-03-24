import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	GetChatOutput,
	GetChatsInput,
	GetChatsOutput,
	MarkMessagesReadOutput,
	SendMessageInput,
	SendMessageOutput,
} from "../types";

export const chatService = {
	getChats: async (params: GetChatsInput = {}): Promise<GetChatsOutput> => {
		const response = await api.get<{ data: GetChatsOutput }>(
			`${ROUTES.CHATS.BASE}${ROUTES.CHATS.ROOT}`,
			{ params },
		);
		return response.data.data;
	},
	getChat: async (otherUserId: string): Promise<GetChatOutput> => {
		const response = await api.get<{ data: GetChatOutput }>(
			`${ROUTES.CHATS.BASE}${ROUTES.CHATS.BY_USER(otherUserId)}`,
		);
		return response.data.data;
	},
	sendMessage: async (
		chatId: string,
		payload: SendMessageInput,
	): Promise<SendMessageOutput> => {
		const response = await api.post<{ data: SendMessageOutput }>(
			`${ROUTES.CHATS.BASE}${ROUTES.CHATS.MESSAGES(chatId)}`,
			payload,
		);
		return response.data.data;
	},
	markMessagesRead: async (chatId: string): Promise<MarkMessagesReadOutput> => {
		const response = await api.patch<{ data: MarkMessagesReadOutput }>(
			`${ROUTES.CHATS.BASE}${ROUTES.CHATS.READ(chatId)}`,
		);
		return response.data.data;
	},
};

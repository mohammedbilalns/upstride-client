import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	GetChatOutput,
	GetChatsInput,
	GetChatsOutput,
	GetChatInput,
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
	getChat: async (
		otherUserId: string,
		params: GetChatInput = {},
	): Promise<GetChatOutput> => {
		try {
			const response = await api.get<{ data: GetChatOutput }>(
				`${ROUTES.CHATS.BASE}${ROUTES.CHATS.BY_USER(otherUserId)}`,
				{ params },
			);
			return response.data.data;
		} catch (error) {
			const status = (error as { response?: { status?: number } })?.response
				?.status;
			if (status === 400) {
				const notFound = new Error("Not Found") as Error & {
					response?: { status?: number };
				};
				notFound.response = { status: 404 };
				throw notFound;
			}
			throw error;
		}
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

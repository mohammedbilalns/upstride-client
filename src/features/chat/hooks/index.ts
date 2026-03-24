import {
	useInfiniteQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { chatService } from "../services/chat.service";
import {
	chatKeys,
	getChatsInfiniteQueryOptions,
	getChatInfiniteQueryOptions,
} from "./queries";
import type { GetChatsInput, SendMessageInput } from "../types";

/**
 * Hook to get the paginated list of all chats.
 */
export const useGetChats = (filters: Omit<GetChatsInput, "page"> = {}) => {
	return useInfiniteQuery(getChatsInfiniteQueryOptions(filters));
};

/**
 * Hook to get a single chat's messages
 */
export const useGetChat = (otherUserId: string) => {
	return useInfiniteQuery(getChatInfiniteQueryOptions(otherUserId));
};

/**
 * Hook to send a message in a chat.
 */
export const useSendMessage = (chatId: string, otherUserId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (payload: SendMessageInput) =>
			chatService.sendMessage(chatId, payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: chatKeys.detail(otherUserId) });
			queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
		},
	});
};

/**
 * Hook to mark all messages in a chat as read.
 */
export const useMarkChatRead = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (chatId: string) => chatService.markMessagesRead(chatId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
		},
	});
};

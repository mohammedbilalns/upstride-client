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
import type { GetChatsInput, SendMessageInput, ChatMessageDto } from "../types";

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
		onMutate: async (newMessagePayload) => {
			await queryClient.cancelQueries({
				queryKey: chatKeys.detail(otherUserId),
			});

			const previousChatData = queryClient.getQueryData(
				chatKeys.detail(otherUserId),
			);

			const optimisticMessage: ChatMessageDto = {
				id: `optimistic-${Date.now()}`,
				chatId,
				senderId: newMessagePayload.senderId || "",
				messageType: newMessagePayload.messageType || "TEXT",
				content: newMessagePayload.content || null,
				attachementId: null,
				mediaUrl: null,
				repliedTo: newMessagePayload.repliedTo || null,
				status: "sending",
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};

			queryClient.setQueryData(chatKeys.detail(otherUserId), (old: any) => {
				if (!old) return old;
				const pages = [...old.pages];
				pages[0].messages = [optimisticMessage, ...pages[0].messages];
				return { ...old, pages };
			});

			return { previousChatData };
		},
		onError: (_err, _newMessage, context: any) => {
			if (context?.previousChatData) {
				queryClient.setQueryData(
					chatKeys.detail(otherUserId),
					context.previousChatData,
				);
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: chatKeys.detail(otherUserId) });
			queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
		},
	});
};

export const useMarkChatRead = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (chatId: string) => chatService.markMessagesRead(chatId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: chatKeys.lists() });
		},
	});
};

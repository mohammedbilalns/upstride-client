import {
	type InfiniteData,
	useInfiniteQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { chatService } from "../services/chat.service";
import type {
	ChatMessageDto,
	GetChatOutput,
	GetChatsInput,
	GetChatsOutput,
	SendMessageInput,
} from "../types";
import {
	chatKeys,
	getChatInfiniteQueryOptions,
	getChatsInfiniteQueryOptions,
} from "./queries";

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

			const previousChatData = queryClient.getQueryData<
				InfiniteData<GetChatOutput>
			>(chatKeys.detail(otherUserId));

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

			queryClient.setQueryData<InfiniteData<GetChatOutput> | undefined>(
				chatKeys.detail(otherUserId),
				(old) => {
					if (!old) return old;
					const pages = [...old.pages];
					pages[0] = {
						...pages[0],
						messages: [optimisticMessage, ...pages[0].messages],
					};
					return { ...old, pages };
				},
			);

			return { previousChatData };
		},
		onError: (
			_err,
			_newMessage,
			context: { previousChatData?: InfiniteData<GetChatOutput> } | undefined,
		) => {
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
		mutationFn: (payload: { chatId: string; userId: string }) =>
			chatService.markMessagesRead(payload.chatId),
		onMutate: ({ chatId, userId }) => {
			queryClient.setQueriesData<InfiniteData<GetChatsOutput> | undefined>(
				{ queryKey: chatKeys.lists() },
				(old) => {
					if (!old?.pages) return old;
					const pages = old.pages.map((page) => ({
						...page,
						chats: page.chats.map((chat) =>
							chat.id === chatId
								? {
										...chat,
										unreadCount: {
											...chat.unreadCount,
											[userId]: 0,
										},
									}
								: chat,
						),
					}));
					return { ...old, pages };
				},
			);
		},
	});
};

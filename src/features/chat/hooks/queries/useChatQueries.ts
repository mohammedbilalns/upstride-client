import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { chatService } from "../../services/chat.service";
import type { GetChatInput, GetChatsInput } from "../../types";

export const chatKeys = {
	all: ["chats"] as const,
	lists: () => [...chatKeys.all, "list"] as const,
	list: (filters: GetChatsInput) => [...chatKeys.lists(), filters] as const,
	detail: (otherUserId: string) =>
		[...chatKeys.all, "detail", otherUserId] as const,
};

export const getChatsInfiniteQueryOptions = (
	filters: Omit<GetChatsInput, "cursor"> = {},
) =>
	infiniteQueryOptions({
		queryKey: chatKeys.list(filters),
		queryFn: ({ pageParam }) =>
			chatService.getChats({
				...filters,
				cursor: (pageParam as string | null) ?? null,
			}),
		initialPageParam: null as string | null,
		getNextPageParam: (lastPage) => lastPage.nextCursor,
	});

export const getChatInfiniteQueryOptions = (
	otherUserId: string,
	filters: Omit<GetChatInput, "cursor"> = {},
) =>
	infiniteQueryOptions({
		queryKey: chatKeys.detail(otherUserId),
		queryFn: ({ pageParam }) =>
			chatService.getChat(otherUserId, {
				...filters,
				cursor: (pageParam as string | null) ?? null,
			}),
		initialPageParam: null as string | null,
		getNextPageParam: (lastPage) => lastPage.nextCursor,
	});

export const getChatQueryOptions = (otherUserId: string) =>
	queryOptions({
		queryKey: chatKeys.detail(otherUserId),
		queryFn: () => chatService.getChat(otherUserId, { cursor: null }),
	});

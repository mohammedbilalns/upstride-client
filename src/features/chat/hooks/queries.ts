import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { chatService } from "../services/chat.service";
import type { GetChatsInput, GetChatInput } from "../types";

export const chatKeys = {
	all: ["chats"] as const,
	lists: () => [...chatKeys.all, "list"] as const,
	list: (filters: GetChatsInput) => [...chatKeys.lists(), filters] as const,
	detail: (otherUserId: string) =>
		[...chatKeys.all, "detail", otherUserId] as const,
};

export const getChatsInfiniteQueryOptions = (
	filters: Omit<GetChatsInput, "page"> = {},
) =>
	infiniteQueryOptions({
		queryKey: chatKeys.list(filters),
		queryFn: ({ pageParam }) =>
			chatService.getChats({ ...filters, page: pageParam as number }),
		initialPageParam: 1,
		getNextPageParam: (lastPage) =>
			lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
	});

export const getChatInfiniteQueryOptions = (
	otherUserId: string,
	filters: Omit<GetChatInput, "page"> = {},
) =>
	infiniteQueryOptions({
		queryKey: chatKeys.detail(otherUserId),
		queryFn: ({ pageParam }) =>
			chatService.getChat(otherUserId, {
				...filters,
				page: pageParam as number,
			}),
		initialPageParam: 1,
		getNextPageParam: (lastPage) =>
			lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
	});

export const getChatQueryOptions = (otherUserId: string) =>
	queryOptions({
		queryKey: chatKeys.detail(otherUserId),
		queryFn: () => chatService.getChat(otherUserId, { page: 1 }),
	});

import { createFileRoute } from "@tanstack/react-router";
import type { ApiError } from "@/api/apiError";
import ErrorComponent from "@/components/common/ErrorComponent";
import { ChatNotFound } from "@/features/chat/components/ChatNotFound";
import { getChatInfiniteQueryOptions } from "@/features/chat/hooks/queries/useChatQueries";

export const Route = createFileRoute("/_app-layout/_user-layout/chats/$chatId")(
	{
		loader: async ({ context: { queryClient }, params }) => {
			await queryClient.ensureInfiniteQueryData(
				getChatInfiniteQueryOptions(params.chatId),
			);
		},
		errorComponent: ({ error }) => {
			const status = (error as ApiError)?.response?.status;
			if (status === 404 || status === 400) {
				return <ChatNotFound />;
			}
			return <ErrorComponent error={error} />;
		},
	},
);

import { createFileRoute } from "@tanstack/react-router";
import ErrorComponent from "@/components/common/Error-Component";
import { ChatNotFound } from "@/features/chat/components/ChatNotFound";
import { getChatInfiniteQueryOptions } from "@/features/chat/hooks/queries";
import { ChatDetailPage } from "@/features/chat/pages/ChatDetailPage";

export const Route = createFileRoute("/_app-layout/_user-layout/chats/$chatId")(
	{
		loader: async ({ context: { queryClient }, params }) => {
			try {
				await queryClient.ensureInfiniteQueryData(
					getChatInfiniteQueryOptions(params.chatId),
				);
			} catch (error) {
				const status =
					(error as { response?: { status?: number } })?.response?.status ??
					(error as { status?: number })?.status;
				if (status === 404 || status === 400) {
					return;
				}
				throw error;
			}
		},
		errorComponent: ({ error }) => {
			const status =
				(error as { response?: { status?: number } })?.response?.status ??
				(error as { status?: number })?.status;
			if (status === 404 || status === 400) {
				return <ChatNotFound />;
			}
			return <ErrorComponent error={error} />;
		},
		component: ChatDetailPage,
	},
);

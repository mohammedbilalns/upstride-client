import { createLazyFileRoute } from "@tanstack/react-router";
import { ChatDetailPage } from "@/features/chat/pages/ChatDetailPage";

export const Route = createLazyFileRoute(
	"/_app-layout/_user-layout/chats/$chatId",
)({
	component: ChatDetailPage,
});

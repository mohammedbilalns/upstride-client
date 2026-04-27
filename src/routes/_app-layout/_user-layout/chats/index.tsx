import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";

export const Route = createFileRoute("/_app-layout/_user-layout/chats/")({
	component: ChatsIndex,
});

function ChatsIndex() {
	return (
		<div className="flex bg-muted/20 flex-col items-center justify-center flex-1 h-full text-center p-8">
			<div className="bg-background w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm">
				<MessageSquare className="w-10 h-10 text-muted-foreground" />
			</div>
			<h2 className="text-2xl font-semibold mb-2">Your Conversations</h2>
			<p className="text-muted-foreground max-w-sm">
				Select a chat from the sidebar or start a new conversation to begin
				messaging.
			</p>
		</div>
	);
}

import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { ChatList } from "@/features/chat/components/ChatList";
import { getChatsInfiniteQueryOptions } from "@/features/chat/hooks/queries";

export const Route = createFileRoute("/_app-layout/_user-layout/chats")({
	loader: async ({ context: { queryClient } }) => {
		await queryClient.ensureInfiniteQueryData(getChatsInfiniteQueryOptions());
	},
	component: ChatsLayout,
});

function ChatsLayout() {
	const location = useLocation();
	const isRootChats =
		location.pathname === "/chats" || location.pathname === "/chats/";

	return (
		<div className="container mx-auto px-4 h-[calc(100vh-8rem)] mb-4">
			<div className="flex h-full overflow-hidden border rounded-xl shadow-sm bg-background">
				<div
					className={`w-full md:w-80 lg:w-96 border-r md:block bg-background ${
						isRootChats ? "block" : "hidden"
					}`}
				>
					<ChatList />
				</div>

				<div
					className={`flex-1 flex flex-col bg-muted/10 ${
						isRootChats ? "hidden md:flex" : "flex"
					}`}
				>
					<Outlet />
				</div>
			</div>
		</div>
	);
}

import { Link, useLocation, useRouteContext } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetChats } from "@/features/chat/hooks";
import { formatChatTimestamp } from "@/shared/utils/date";

export function ChatList() {
	const location = useLocation();
	const { auth } = useRouteContext({ from: "/_app-layout/_user-layout/chats" });
	const currentUserId = auth.user?.id;

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
	} = useGetChats();

	// Flatten pages into a single array
	const chats = data?.pages.flatMap((page) => page.chats) ?? [];

	return (
		<div className="flex flex-col h-full bg-background border-r">
			<div className="p-4 border-b">
				<h2 className="text-xl font-semibold">Chats</h2>
			</div>

			<ScrollArea className="flex-1 min-h-0">
				<div className="flex flex-col">
					{isLoading && (
						<div className="p-4 text-sm text-muted-foreground">
							Loading chats…
						</div>
					)}

					{isError && (
						<div className="p-4 text-sm text-destructive">
							Failed to load chats. Please try again.
						</div>
					)}

					{!isLoading && chats.length === 0 && (
						<div className="p-4 text-sm text-muted-foreground">
							No conversations yet.
						</div>
					)}

					{chats.map((chat) => {
						const otherUser = chat.receiver;
						const otherUserId = otherUser?.id || chat.receiverId;
						const isActive = location.pathname.includes(
							`/chats/${otherUserId}`,
						);
						const unreadCount = chat.unreadCount[currentUserId ?? ""] ?? 0;
						const lastMessage = chat.lastMessage;
						const isSender = lastMessage?.senderId === currentUserId;
						const lastMessageLabel = (() => {
							if (!lastMessage) return "No messages yet";
							if (lastMessage.messageType === "IMAGE") {
								return `${isSender ? "You: " : ""}Photo`;
							}
							if (lastMessage.messageType === "FILE") {
								return `${isSender ? "You: " : ""}File`;
							}
							return `${isSender ? "You: " : ""}${lastMessage.content ?? ""}`;
						})();
						const lastMessageTime = lastMessage?.createdAt ?? chat.updatedAt;

						return (
							<Link
								key={chat.id}
								to="/chats/$chatId"
								params={{ chatId: otherUserId }}
								className={`flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors border-b last:border-0 ${
									isActive ? "bg-muted" : ""
								}`}
							>
								<div className="relative">
									<Avatar>
										<AvatarImage
											src={otherUser?.profilePictureUrl || ""}
											alt={otherUser?.name}
										/>
										<AvatarFallback>
											{(otherUser?.name || otherUserId)
												.slice(0, 2)
												.toUpperCase()}
										</AvatarFallback>
									</Avatar>
								</div>
								<div className="flex-1 overflow-hidden">
									<div className="flex justify-between items-center mb-1">
										<h3 className="font-medium truncate text-sm">
											{otherUser?.name || otherUserId}
										</h3>
										<span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
											{formatChatTimestamp(lastMessageTime, {
												showDateIfNotToday: true,
											})}
										</span>
									</div>
									<div className="flex justify-between items-center gap-2">
										<p className="text-xs text-muted-foreground truncate">
											{lastMessageLabel}
										</p>
										{unreadCount > 0 && (
											<span className="flex items-center justify-center w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex-shrink-0">
												{unreadCount}
											</span>
										)}
									</div>
								</div>
							</Link>
						);
					})}

					{hasNextPage && (
						<div className="p-4 border-t flex justify-center">
							<Button
								variant="ghost"
								size="sm"
								className="text-xs text-muted-foreground hover:text-foreground"
								onClick={() => fetchNextPage()}
								disabled={isFetchingNextPage}
							>
								{isFetchingNextPage ? "Loading more..." : "Load more chats"}
							</Button>
						</div>
					)}
				</div>
			</ScrollArea>
		</div>
	);
}

import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/features/chat/components/ChatMessage";
import {
	useGetChat,
	useSendMessage,
	useMarkChatRead,
} from "@/features/chat/hooks";
import { getChatInfiniteQueryOptions } from "@/features/chat/hooks/queries";
import { ArrowLeft, Send, Paperclip, Image as ImageIcon } from "lucide-react";
import type { ChatMessageDto } from "@/features/chat/types";

export const Route = createFileRoute("/_user-layout/chats/$chatId")({
	loader: async ({ context: { queryClient }, params }) => {
		// Pre-fetch the first page of messages before the component mounts
		await queryClient.ensureInfiniteQueryData(
			getChatInfiniteQueryOptions(params.chatId),
		);
	},
	component: ChatDetail,
});

function ChatDetail() {
	const { chatId } = Route.useParams();
	const location = useLocation();
	const { auth } = Route.useRouteContext();
	const currentUserId = auth.user?.id;

	const [newMessage, setNewMessage] = useState("");
	const scrollRef = useRef<HTMLDivElement>(null);
	const pendingRestoreRef = useRef(false);
	const prevScrollHeightRef = useRef(0);

	const imageInputRef = useRef<HTMLInputElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
	} = useGetChat(chatId);

	// Flatten all pages and sort oldest-first for the chat view
	const allMessages: ChatMessageDto[] =
		data?.pages
			.flatMap((page) => page.messages)
			.sort(
				(a, b) =>
					new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
			) ?? [];

	const chat = data?.pages[0]?.chat;
	const locationState = location.state as
		| {
				receiver?: {
					id: string;
					name: string;
					profilePictureUrl?: string | null;
				};
		  }
		| undefined;
	const otherUser = chat?.receiver ?? locationState?.receiver ?? null;

	const sendMessage = useSendMessage(chat?.id ?? chatId, chatId);
	const markRead = useMarkChatRead();

	// Scroll to bottom when new messages arrive (only if user is near bottom)
	useEffect(() => {
		if (!scrollRef.current) return;
		if (pendingRestoreRef.current) return;
		const el = scrollRef.current;
		const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
		const isNearBottom = distanceFromBottom < 80;
		if (isNearBottom) {
			el.scrollTo(0, el.scrollHeight);
		}
	}, [allMessages.length]);

	// Maintain scroll position when loading older messages
	useLayoutEffect(() => {
		if (!pendingRestoreRef.current || !scrollRef.current) return;
		const el = scrollRef.current;
		const newHeight = el.scrollHeight;
		const prevHeight = prevScrollHeightRef.current;
		el.scrollTop += newHeight - prevHeight;
		pendingRestoreRef.current = false;
	}, [data]);

	// Mark messages as read when the chat opens
	useEffect(() => {
		if (chat?.id) {
			markRead.mutate(chat.id);
		}
	}, [chat?.id]);

	// Infinite scroll – load older messages when the user scrolls to the top sentinel
	const handleSend = (e?: React.FormEvent) => {
		e?.preventDefault();
		if (!newMessage.trim()) return;
		sendMessage.mutate({ content: newMessage.trim() });
		setNewMessage("");
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		// TODO: upload file to storage, then send with mediaId
		// For now, shows the file name as text
		sendMessage.mutate({ content: `[Image: ${file.name}]` });
		e.target.value = "";
	};

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		// TODO: upload file to storage, then send with mediaId
		sendMessage.mutate({ content: `[File: ${file.name}]` });
		e.target.value = "";
	};

	if (isLoading) {
		return (
			<div className="flex flex-1 items-center justify-center p-8 text-muted-foreground text-sm">
				Loading conversation…
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex flex-1 flex-col items-center justify-center p-8 text-center gap-4">
				<p className="text-sm text-destructive">Failed to load conversation.</p>
				<Button asChild variant="outline">
					<Link to="/chats">Back to chats</Link>
				</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full bg-background">
			{/* Top Bar */}
			<div className="flex items-center gap-3 p-4 border-b bg-background shadow-sm z-10 sticky top-0">
				<Button variant="ghost" size="icon" asChild className="md:hidden">
					<Link to="/chats">
						<ArrowLeft className="w-5 h-5" />
					</Link>
				</Button>

				<Avatar className="w-10 h-10">
					<AvatarImage
						src={otherUser?.profilePictureUrl || ""}
						alt={otherUser?.name}
					/>
					<AvatarFallback>
						{(otherUser?.name || chatId).slice(0, 2).toUpperCase()}
					</AvatarFallback>
				</Avatar>

				<div className="flex-1">
					<h2 className="font-semibold text-sm">{otherUser?.name || chatId}</h2>
				</div>
			</div>

			{/* Message Thread */}
			<ScrollArea
				viewportRef={scrollRef}
				className="flex-1 min-h-0 bg-muted/10"
			>
				<div className="p-4 flex flex-col justify-end">
					{hasNextPage && (
						<div className="flex justify-center mb-3 pt-2">
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => {
									if (!scrollRef.current) {
										fetchNextPage();
										return;
									}
									prevScrollHeightRef.current = scrollRef.current.scrollHeight;
									pendingRestoreRef.current = true;
									fetchNextPage();
								}}
								disabled={isFetchingNextPage}
							>
								{isFetchingNextPage ? "Loading…" : "View older messages"}
							</Button>
						</div>
					)}

					{isFetchingNextPage && (
						<div className="text-xs text-center text-muted-foreground py-2">
							Loading older messages…
						</div>
					)}

					{allMessages.length === 0 ? (
						<div className="flex-1 flex items-center justify-center text-center text-muted-foreground text-sm py-8">
							No messages yet. Send a message to start the conversation!
						</div>
					) : (
						<div className="flex flex-col gap-2">
							{allMessages.map((msg) => (
								<ChatMessage
									key={msg.id}
									message={msg}
									isMe={msg.senderId === currentUserId}
								/>
							))}
						</div>
					)}
				</div>
			</ScrollArea>

			{/* Input Area */}
			<div className="p-4 border-t bg-background">
				<form onSubmit={handleSend} className="flex items-center gap-2">
					<input
						type="file"
						accept="image/*"
						className="hidden"
						ref={imageInputRef}
						onChange={handleImageUpload}
					/>
					<input
						type="file"
						accept=".pdf,.doc,.docx,.txt"
						className="hidden"
						ref={fileInputRef}
						onChange={handleFileUpload}
					/>

					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="shrink-0 text-muted-foreground"
						onClick={() => imageInputRef.current?.click()}
					>
						<ImageIcon className="w-5 h-5" />
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="shrink-0 text-muted-foreground -ml-2"
						onClick={() => fileInputRef.current?.click()}
					>
						<Paperclip className="w-5 h-5" />
					</Button>

					<Input
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
						placeholder="Type a message…"
						className="flex-1 rounded-full px-4"
					/>

					<Button
						type="submit"
						size="icon"
						disabled={!newMessage.trim() || sendMessage.isPending}
						className="shrink-0 rounded-full"
					>
						<Send className="w-4 h-4" />
					</Button>
				</form>
			</div>
		</div>
	);
}

import {
	Link,
	useLocation,
	useParams,
	useRouteContext,
} from "@tanstack/react-router";
import type { Emoji } from "frimousse";
import {
	ArrowLeft,
	Image as ImageIcon,
	Loader2,
	Paperclip,
	Send,
	Smile,
} from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	EmojiPicker,
	EmojiPickerContent,
	EmojiPickerFooter,
	EmojiPickerSearch,
} from "@/components/ui/emoji-picker";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/features/chat/components/ChatMessage";
import { ChatNotFound } from "@/features/chat/components/ChatNotFound";
import {
	useGetChat,
	useMarkChatRead,
	useSendMessage,
} from "@/features/chat/hooks";
import { chatKeys } from "@/features/chat/hooks/queries";
import type { ChatMessageDto } from "@/features/chat/types";
import { publicMentorProfileService } from "@/features/mentor-public-profile/services/public-mentor-profile.service";
import { fileService } from "@/shared/services/file.service";

export function ChatDetailPage() {
	const { chatId } = useParams({
		from: "/_app-layout/_user-layout/chats/$chatId",
	});
	const location = useLocation();
	const { auth } = useRouteContext({ from: "/_app-layout" });
	const currentUserId = auth.user?.id;

	const [newMessage, setNewMessage] = useState("");
	const scrollRef = useRef<HTMLDivElement>(null);
	const pendingRestoreRef = useRef(false);
	const prevScrollHeightRef = useRef(0);
	const [localMediaPreviews, setLocalMediaPreviews] = useState<
		Record<string, string>
	>({});
	const [isUploadingMedia, setIsUploadingMedia] = useState(false);
	const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
	const queryClient = useQueryClient();

	useEffect(() => {
		return () => {
			Object.values(localMediaPreviews).forEach((url) =>
				URL.revokeObjectURL(url),
			);
		};
	}, [localMediaPreviews]);

	const imageInputRef = useRef<HTMLInputElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const messageInputRef = useRef<HTMLInputElement>(null);

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
		error,
	} = useGetChat(chatId);
	const errorStatus = (error as { response?: { status?: number } })?.response
		?.status;

	const allMessages: ChatMessageDto[] =
		data?.pages
			.flatMap((page) => page.messages)
			.sort(
				(a, b) =>
					new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
			) ?? [];

	const chat = data?.pages[0]?.chat;
	const receiverFromApi = data?.pages[0]?.receiver;
	const locationState = location.state as
		| {
				receiver?: {
					id: string;
					name: string;
					profilePictureUrl?: string | null;
				};
		  }
		| undefined;

	const shouldFetchReceiver =
		!locationState?.receiver &&
		!receiverFromApi &&
		(errorStatus === 404 || errorStatus === 400);
	const { data: mentorProfileResponse } = useQuery({
		queryKey: ["public-mentor-profile", chatId],
		queryFn: () => publicMentorProfileService.getPublicProfile(chatId),
		enabled: shouldFetchReceiver,
	});
	const receiverFromProfile = mentorProfileResponse
		? {
				id: mentorProfileResponse.data.profile.user.id,
				name: mentorProfileResponse.data.profile.user.name,
				profilePictureUrl:
					mentorProfileResponse.data.profile.user.avatar ?? null,
			}
		: null;

	const otherUser =
		chat?.receiver ??
		receiverFromApi ??
		locationState?.receiver ??
		receiverFromProfile ??
		null;

	const isNewChat =
		!isLoading && (isError || !data?.pages?.length) && !chat && !!otherUser;

	const sendMessage = useSendMessage(chat?.id ?? chatId, chatId);
	const markRead = useMarkChatRead();

	useLayoutEffect(() => {
		if (!scrollRef.current || pendingRestoreRef.current) return;

		const el = scrollRef.current;
		const lastMessage = allMessages[allMessages.length - 1];
		const isMe = lastMessage?.senderId === currentUserId;

		const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
		const isNearBottom = distanceFromBottom < 150;

		if (isMe || isNearBottom) {
			requestAnimationFrame(() => {
				el.scrollTo({
					top: el.scrollHeight,
					behavior: isMe ? "smooth" : "auto",
				});
			});
		}
	}, [allMessages.length, currentUserId]);

	useLayoutEffect(() => {
		if (!pendingRestoreRef.current || !scrollRef.current) return;
		const el = scrollRef.current;
		const newHeight = el.scrollHeight;
		const prevHeight = prevScrollHeightRef.current;
		el.scrollTop += newHeight - prevHeight;
		pendingRestoreRef.current = false;
	}, [data]);

	useEffect(() => {
		if (chat?.id && currentUserId) {
			markRead.mutate({ chatId: chat.id, userId: currentUserId });
		}
	}, [chat?.id, currentUserId]);

	useEffect(() => {
		if (!chat) return;
		queryClient.setQueriesData({ queryKey: chatKeys.lists() }, (old: any) => {
			if (!old?.pages?.length) return old;
			const alreadyIncluded = old.pages.some((page: any) =>
				page.chats?.some((item: any) => item.id === chat.id),
			);
			if (alreadyIncluded) return old;
			const pages = [...old.pages];
			const firstPage = pages[0];
			const updatedFirst = {
				...firstPage,
				chats: [...(firstPage.chats ?? []), chat],
			};
			pages[0] = updatedFirst;
			const limit = firstPage.limit ?? 10;
			const total = (old.total ?? 0) + 1;
			return {
				...old,
				pages,
				total,
				totalPages: limit ? Math.ceil(total / limit) : old.totalPages,
			};
		});
	}, [chat, queryClient]);

	const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
		if (scrollRef.current) {
			const el = scrollRef.current;
			el.scrollTo({ top: el.scrollHeight, behavior });
		}
	};

	const handleSend = (e?: React.FormEvent) => {
		e?.preventDefault();
		if (!newMessage.trim()) return;
		sendMessage.mutate({
			content: newMessage.trim(),
			messageType: "TEXT",
			senderId: currentUserId,
		});
		setNewMessage("");
		requestAnimationFrame(() => scrollToBottom("smooth"));
	};

	const handleEmojiSelect = (emoji: Emoji) => {
		setNewMessage((prev) => `${prev}${emoji.emoji}`);
		setIsEmojiPickerOpen(false);
		requestAnimationFrame(() => messageInputRef.current?.focus());
	};

	const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (file.size > 5 * 1024 * 1024) {
			toast.error("Image size must be less than 5MB");
			e.target.value = "";
			return;
		}

		setIsUploadingMedia(true);
		const previewUrl = URL.createObjectURL(file);
		setLocalMediaPreviews((prev) => ({ ...prev, [file.name]: previewUrl }));
		requestAnimationFrame(() => scrollToBottom("smooth"));

		try {
			const key = await fileService.handleFileUpload(file, "chat-media");
			sendMessage.mutate({
				content: file.name,
				mediaId: key,
				messageType: "IMAGE",
				senderId: currentUserId,
			});
		} catch {
			toast.error("Failed to upload image");
		} finally {
			setIsUploadingMedia(false);
			e.target.value = "";
		}
	};

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (file.type !== "application/pdf") {
			toast.error("Only PDF files are supported");
			e.target.value = "";
			return;
		}
		if (file.size > 10 * 1024 * 1024) {
			toast.error("PDF size must be less than 10MB");
			e.target.value = "";
			return;
		}

		setIsUploadingMedia(true);
		const previewUrl = URL.createObjectURL(file);
		setLocalMediaPreviews((prev) => ({ ...prev, [file.name]: previewUrl }));
		requestAnimationFrame(() => scrollToBottom("smooth"));

		try {
			const key = await fileService.handleFileUpload(file, "chat-media");
			sendMessage.mutate({
				content: file.name,
				mediaId: key,
				messageType: "FILE",
				senderId: currentUserId,
			});
		} catch {
			toast.error("Failed to upload document");
		} finally {
			setIsUploadingMedia(false);
			e.target.value = "";
		}
	};

	if (isLoading) {
		return (
			<div className="flex flex-1 items-center justify-center p-8 text-muted-foreground text-sm">
				Loading conversation…
			</div>
		);
	}

	if (isError && !isNewChat) {
		if (errorStatus === 404 || errorStatus === 400) {
			return <ChatNotFound />;
		}
		return (
			<div className="flex flex-1 flex-col items-center justify-center p-8 text-center gap-4">
				<p className="text-sm text-destructive">Failed to load conversation.</p>
				<Button asChild variant="outline">
					<Link to="/chats">Back to chats</Link>
				</Button>
			</div>
		);
	}

	if (!chat && !isNewChat) {
		return <ChatNotFound />;
	}

	return (
		<div className="flex flex-col h-full bg-background">
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
									localMediaPreviews={localMediaPreviews}
								/>
							))}
						</div>
					)}
				</div>
			</ScrollArea>

			<div className="p-4 border-t bg-background relative">
				{isUploadingMedia && (
					<div className="absolute -top-10 left-0 right-0 flex justify-center pb-2">
						<div className="bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full border shadow-sm flex items-center gap-2 text-xs text-muted-foreground animate-in fade-in slide-in-from-bottom-2">
							<Loader2 className="w-3 h-3 animate-spin" />
							<span>Uploading media...</span>
						</div>
					</div>
				)}

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
						accept=".pdf,application/pdf"
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
						disabled={isUploadingMedia || sendMessage.isPending}
					>
						<ImageIcon className="w-5 h-5" />
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="shrink-0 text-muted-foreground -ml-2"
						onClick={() => fileInputRef.current?.click()}
						disabled={isUploadingMedia || sendMessage.isPending}
					>
						<Paperclip className="w-5 h-5" />
					</Button>

					<Popover open={isEmojiPickerOpen} onOpenChange={setIsEmojiPickerOpen}>
						<PopoverTrigger asChild>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="shrink-0 text-muted-foreground -ml-2"
								disabled={isUploadingMedia || sendMessage.isPending}
								aria-label="Open emoji picker"
							>
								<Smile className="w-5 h-5" />
							</Button>
						</PopoverTrigger>
						<PopoverContent
							align="end"
							side="top"
							sideOffset={8}
							className="p-0"
						>
							<EmojiPicker
								className="h-80 w-72"
								onEmojiSelect={handleEmojiSelect}
							>
								<EmojiPickerSearch />
								<EmojiPickerContent />
								<EmojiPickerFooter />
							</EmojiPicker>
						</PopoverContent>
					</Popover>

					<Input
						ref={messageInputRef}
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
						placeholder={
							isUploadingMedia ? "Please wait..." : "Type a message…"
						}
						className="flex-1 rounded-full px-4"
						disabled={isUploadingMedia || sendMessage.isPending}
					/>

					<Button
						type="submit"
						size="icon"
						disabled={
							!newMessage.trim() || sendMessage.isPending || isUploadingMedia
						}
						className="shrink-0 rounded-full"
					>
						{sendMessage.isPending ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							<Send className="w-4 h-4" />
						)}
					</Button>
				</form>
			</div>
		</div>
	);
}

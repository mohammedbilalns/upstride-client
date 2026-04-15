import { useCallback, useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import type { ChatMessagePayload } from "../types/call-events";

export interface ChatMessage extends ChatMessagePayload {
	isSelf: boolean;
}

export const useChat = (
	bookingId: string,
	socket: Socket | null,
	currentUserId: string | undefined,
	onMessageReceived?: (message: ChatMessage) => void,
) => {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [hasUnread, setHasUnread] = useState(false);

	useEffect(() => {
		if (!socket) return;

		const handleChatMessage = (payload: ChatMessagePayload) => {
			setMessages((prev) => [
				...prev,
				{
					...payload,
					isSelf: payload.senderId === currentUserId,
				},
			]);

			// We'll let the component handle marking as read when open
			setHasUnread(true);

			const isSelf = payload.senderId === currentUserId;
			if (!isSelf && onMessageReceived) {
				onMessageReceived({ ...payload, isSelf });
			}
		};

		socket.on("call:chat-message", handleChatMessage);

		return () => {
			socket.off("call:chat-message", handleChatMessage);
		};
	}, [socket, currentUserId]);

	const sendMessage = useCallback(
		(message: string) => {
			if (!socket || !message.trim()) return;

			const payload = {
				bookingId,
				message: message.trim(),
			};

			socket.emit("call:chat-message", payload);

			// Add to local state immediately
			setMessages((prev) => [
				...prev,
				{
					senderId: currentUserId || "me",
					message: message.trim(),
					timestamp: new Date().toISOString(),
					isSelf: true,
				},
			]);
		},
		[socket, bookingId, currentUserId],
	);

	const clearUnread = useCallback(() => {
		setHasUnread(false);
	}, []);

	return {
		messages,
		sendMessage,
		hasUnread,
		clearUnread,
	};
};

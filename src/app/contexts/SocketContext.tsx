import type { InfiniteData } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation, useRouter } from "@tanstack/react-router";
import type React from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";
import { toast } from "sonner";
import type { ChatMessageDto, GetChatOutput } from "@/features/chat/types";
import type {
	GetUnreadNotificationCountOutput,
	NotificationDto,
} from "@/features/notifications/types";
import {
	disconnectSocket,
	getSocketInstance,
} from "@/shared/services/socket.service";

interface SocketContextType {
	socket: Socket | null;
	isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
	socket: null,
	isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const queryClient = useQueryClient();
	const location = useLocation();
	const router = useRouter();
	const pathnameRef = useRef(location.pathname);

	// Get auth state from router context
	const auth = router.options.context?.auth;
	const token = auth?.accessToken;
	const isAuthenticated = auth?.isAuthenticated;
	const userRole = auth?.user?.role;
	const isAdminRole = userRole === "ADMIN" || userRole === "SUPER_ADMIN";

	useEffect(() => {
		pathnameRef.current = location.pathname;
	}, [location.pathname]);

	useEffect(() => {
		if (isAuthenticated && token && !isAdminRole) {
			console.log("[WS] Initializing connection with token");
			const socketInstance = getSocketInstance(token);
			setSocket(socketInstance);

			const handleConnect = () => {
				setIsConnected(true);
				console.log("[WS] Connected to server");
			};

			const handleDisconnect = (reason: string) => {
				setIsConnected(false);
				console.log(`[WS] Disconnected: ${reason}`);
			};

			const handleConnectError = (error: Error) => {
				console.error("[WS] Connection error:", error);
			};

			// Global Event Listeners

			// New Chat Message
			const handleChatMessage = (data: {
				chatId: string;
				message: ChatMessageDto;
			}) => {
				console.log("[WS] Received chat:message", data);

				//  Update chat history if we are currently in that chat
				const currentChatId = pathnameRef.current.split("/").pop();
				if (
					currentChatId === data.chatId ||
					currentChatId === data.message.senderId
				) {
					console.log("[WS] Updating current chat messages cache");
					queryClient.setQueryData<InfiniteData<GetChatOutput>>(
						["chats", data.chatId],
						(oldData) => {
							if (!oldData) return oldData;
							return {
								...oldData,
								pages: oldData.pages.map((page, index) => {
									if (index === 0) {
										return {
											...page,
											messages: [data.message, ...page.messages],
										};
									}
									return page;
								}),
							};
						},
					);
				}

				// Invalidate/Update Chat List to show last message and unread count
				console.log("[WS] Invalidating chats list query");
				queryClient.invalidateQueries({ queryKey: ["chats"] });
			};

			// New Notification
			const handleNotificationNew = (data: {
				notification: NotificationDto;
			}) => {
				console.log("[WS] Received notification:new", data);

				// Update notification count badge
				queryClient.setQueryData<GetUnreadNotificationCountOutput>(
					["notifications", "unread-count"],
					(old) => {
						const currentCount = old?.count ?? 0;
						return { count: currentCount + 1 };
					},
				);

				// Invalidate notifications list
				queryClient.invalidateQueries({ queryKey: ["notifications"] });

				toast.info(data.notification.title, {
					description: data.notification.description,
				});
			};

			// Centralized Socket Error Handling
			const handleSocketError = (data: {
				message: string;
				statusCode?: number;
			}) => {
				console.error("[WS] Centralized Error:", data);
				toast.error(data.message || "A socket error occurred.");
			};

			socketInstance.on("connect", handleConnect);
			socketInstance.on("disconnect", handleDisconnect);
			socketInstance.on("connect_error", handleConnectError);
			socketInstance.on("chat:message", handleChatMessage);
			socketInstance.on("notification:new", handleNotificationNew);
			socketInstance.on("socket:error", handleSocketError);

			return () => {
				socketInstance.off("connect", handleConnect);
				socketInstance.off("disconnect", handleDisconnect);
				socketInstance.off("connect_error", handleConnectError);
				socketInstance.off("chat:message", handleChatMessage);
				socketInstance.off("notification:new", handleNotificationNew);
				socketInstance.off("socket:error", handleSocketError);
			};
		} else {
			if (isAdminRole) {
				console.log("[WS] Admin role detected, skipping connection");
			} else {
				console.log("[WS] No auth found, disconnecting if necessary");
			}
			disconnectSocket();
			setSocket(null);
			setIsConnected(false);
		}
	}, [isAuthenticated, token, isAdminRole, queryClient]);

	return (
		<SocketContext.Provider value={{ socket, isConnected }}>
			{children}
		</SocketContext.Provider>
	);
};

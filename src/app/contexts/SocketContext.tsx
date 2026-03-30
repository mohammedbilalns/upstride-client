import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { Socket } from "socket.io-client";
import { useLocation, useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { SocketService } from "@/shared/services/socket.service";
import { toast } from "sonner";

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
			const socketInstance = SocketService.getInstance(token);
			setSocket(socketInstance);

			socketInstance.on("connect", () => {
				setIsConnected(true);
				console.log("[WS] Connected to server");
			});

			socketInstance.on("disconnect", (reason) => {
				setIsConnected(false);
				console.log(`[WS] Disconnected: ${reason}`);
			});

			socketInstance.on("connect_error", (error) => {
				console.error("[WS] Connection error:", error);
			});

			// Global Event Listeners

			// New Chat Message
			socketInstance.on(
				"chat:message",
				(data: { chatId: string; message: any }) => {
					console.log("[WS] Received chat:message", data);

					//  Update chat history if we are currently in that chat
					const currentChatId = pathnameRef.current.split("/").pop();
					if (
						currentChatId === data.chatId ||
						currentChatId === data.message.senderId
					) {
						console.log("[WS] Updating current chat messages cache");
						queryClient.setQueryData(["chats", data.chatId], (oldData: any) => {
							if (!oldData) return oldData;
							return {
								...oldData,
								pages: oldData.pages.map((page: any, index: number) => {
									if (index === 0) {
										return {
											...page,
											messages: [data.message, ...page.messages],
										};
									}
									return page;
								}),
							};
						});
					}

					// Invalidate/Update Chat List to show last message and unread count
					console.log("[WS] Invalidating chats list query");
					queryClient.invalidateQueries({ queryKey: ["chats"] });
				},
			);

			// New Notification
			socketInstance.on("notification:new", (data: { notification: any }) => {
				console.log("[WS] Received notification:new", data);

				// Update notification count badge
				queryClient.setQueryData(
					["notifications", "unread-count"],
					(old: any) => {
						const currentCount = old?.data || 0;
						return { ...old, data: currentCount + 1 };
					},
				);

				// Invalidate notifications list
				queryClient.invalidateQueries({ queryKey: ["notifications"] });

				toast.info(data.notification.title, {
					description: data.notification.description,
				});
			});

			return () => {
				socketInstance.off("connect");
				socketInstance.off("disconnect");
				socketInstance.off("connect_error");
				socketInstance.off("chat:message");
				socketInstance.off("notification:new");
			};
		} else {
			if (isAdminRole) {
				console.log("[WS] Admin role detected, skipping connection");
			} else {
				console.log("[WS] No auth found, disconnecting if necessary");
			}
			SocketService.disconnect();
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

import { io, type Socket } from "socket.io-client";
import { env } from "@/shared/config/env";

let socketInstance: Socket | null = null;

/**
 * Creates or returns the existing Socket.io instance.
 * @param token The JWT access token for authentication.
 */
export const getSocketInstance = (token: string): Socket => {
	if (socketInstance) {
		return socketInstance;
	}

	const socketUrl = new URL(env.API_URL).origin;

	socketInstance = io(socketUrl, {
		auth: {
			token,
		},
		transports: ["websocket"],
		reconnection: true,
		reconnectionAttempts: 5,
	});

	return socketInstance;
};

/**
 * Disconnects the socket and clears the instance.
 */
export const disconnectSocket = (): void => {
	if (socketInstance) {
		socketInstance.disconnect();
		socketInstance = null;
	}
};

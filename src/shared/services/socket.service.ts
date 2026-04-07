import { io, type Socket } from "socket.io-client";
import { env } from "@/shared/config/env";

export class SocketService {
	private static instance: Socket | null = null;

	/**
	 * Creates or returns the existing Socket.io instance.
	 * @param token The JWT access token for authentication.
	 */
	public static getInstance(token: string): Socket {
		if (SocketService.instance) {
			return SocketService.instance;
		}

		const socketUrl = new URL(env.API_URL).origin;

		SocketService.instance = io(socketUrl, {
			auth: {
				token,
			},
			transports: ["websocket"],
			reconnection: true,
			reconnectionAttempts: 5,
		});

		return SocketService.instance;
	}

	/**
	 * Disconnects the socket and clears the instance.
	 */
	public static disconnect(): void {
		if (SocketService.instance) {
			SocketService.instance.disconnect();
			SocketService.instance = null;
		}
	}
}

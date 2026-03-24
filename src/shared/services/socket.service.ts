import { io, Socket } from "socket.io-client";
import { env } from "@/shared/config/env";

export class SocketService {
	private static instance: Socket | null = null;

	/**
	 * Creates or returns the existing Socket.io instance.
	 * @param token The JWT access token for authentication.
	 */
	public static getInstance(token: string): Socket {
		if (this.instance) {
			return this.instance;
		}

		const socketUrl = new URL(env.API_URL).origin;

		this.instance = io(socketUrl, {
			auth: {
				token,
			},
			transports: ["websocket"],
			reconnection: true,
			reconnectionAttempts: 5,
		});

		return this.instance;
	}

	/**
	 * Disconnects the socket and clears the instance.
	 */
	public static disconnect(): void {
		if (this.instance) {
			this.instance.disconnect();
			this.instance = null;
		}
	}
}

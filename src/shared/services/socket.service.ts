import { io, type Socket } from "socket.io-client";
import { env } from "@/shared/config/env";

let socketInstance: Socket | null = null;
const SOCKET_RECONNECT_TIMEOUT_MS = 5000;

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

export const ensureSocketConnected = async (
	socket: Socket | null,
	timeoutMs: number = SOCKET_RECONNECT_TIMEOUT_MS,
): Promise<Socket> => {
	if (!socket) {
		throw new Error("Socket is not initialized.");
	}

	if (socket.connected) {
		return socket;
	}

	if (!socket.active) {
		socket.connect();
	}

	await new Promise<void>((resolve, reject) => {
		const timeoutId = window.setTimeout(() => {
			cleanup();
			reject(new Error("Socket reconnection timed out."));
		}, timeoutMs);

		const handleConnect = () => {
			cleanup();
			resolve();
		};

		const handleError = (error: Error) => {
			cleanup();
			reject(error);
		};

		const cleanup = () => {
			window.clearTimeout(timeoutId);
			socket.off("connect", handleConnect);
			socket.off("connect_error", handleError);
		};

		socket.on("connect", handleConnect);
		socket.on("connect_error", handleError);
	});

	return socket;
};

export const emitWhenConnected = async <TPayload>(
	socket: Socket | null,
	event: string,
	payload: TPayload,
): Promise<boolean> => {
	try {
		const liveSocket = await ensureSocketConnected(socket);
		liveSocket.emit(event, payload);
		return true;
	} catch (error) {
		console.error(`[WS] Failed to emit ${event}`, error);
		return false;
	}
};

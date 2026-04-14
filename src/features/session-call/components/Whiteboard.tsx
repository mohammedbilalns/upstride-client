import type React from "react";
import { useEffect, useState } from "react";
import { Tldraw, useEditor } from "tldraw";
import "tldraw/tldraw.css";
import type { Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";

interface WhiteboardProps {
	socket: Socket | null;
	bookingId: string;
	isMentor: boolean;
	menteeId?: string;
}

const WhiteboardSync: React.FC<{
	socket: Socket | null;
	bookingId: string;
	isReadonly: boolean;
}> = ({ socket, bookingId, isReadonly }) => {
	const editor = useEditor();

	useEffect(() => {
		if (!socket || !editor) return;

		// Listen to incoming syncs
		const handleSync = ({ update }: { update: any }) => {
			// Very simple synchronization logic
			// In a production app you would use a proper Yjs provider
			// For now, if we receive an update we apply it if we're not actively editing
			// Or just merge documents. However, TLDraw natively handles this better with @tldraw/sync.
		};

		socket.on("whiteboard:sync", handleSync);

		return () => {
			socket.off("whiteboard:sync", handleSync);
		};
	}, [socket, editor]);

	useEffect(() => {
		editor.updateInstanceState({ isReadonly });
	}, [editor, isReadonly]);

	return null;
};

export const Whiteboard: React.FC<WhiteboardProps> = ({
	socket,
	bookingId,
	isMentor,
	menteeId,
}) => {
	const [hasPermission, setHasPermission] = useState(isMentor);

	useEffect(() => {
		if (!socket) return;
		socket.on("whiteboard:permission", (payload: { allow: boolean }) => {
			if (!isMentor) {
				setHasPermission(payload.allow);
			}
		});

		return () => {
			socket.off("whiteboard:permission");
		};
	}, [socket, isMentor]);

	const [menteeHasPermission, setMenteeHasPermission] = useState(false);

	const togglePermission = () => {
		if (!isMentor || !socket) return;
		const newPerm = !menteeHasPermission;
		setMenteeHasPermission(newPerm);

		socket.emit("whiteboard:permission", {
			bookingId,
			menteeId,
			allow: newPerm,
		});
	};

	return (
		<div className="absolute inset-0 z-20 bg-background flex flex-col">
			{isMentor && (
				<div className="absolute top-4 right-4 z-50">
					<Button
						variant={menteeHasPermission ? "default" : "secondary"}
						onClick={togglePermission}
					>
						{menteeHasPermission
							? "Revoke Mentee Drawing Access"
							: "Grant Mentee Drawing Access"}
					</Button>
				</div>
			)}
			<div className="flex-1 w-full relative">
				<Tldraw>
					<WhiteboardSync
						socket={socket}
						bookingId={bookingId}
						isReadonly={!hasPermission}
					/>
				</Tldraw>
			</div>
		</div>
	);
};

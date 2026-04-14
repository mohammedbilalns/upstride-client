import type React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import type {
	ExcalidrawImperativeAPI,
	ExcalidrawElement,
} from "@excalidraw/excalidraw/types/types";
import type { Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Users, Lock, Unlock, MousePointer2 } from "lucide-react";
import { toast } from "sonner";

interface WhiteboardProps {
	socket: Socket | null;
	bookingId: string;
	isMentor: boolean;
	menteeId?: string;
}

export const Whiteboard: React.FC<WhiteboardProps> = ({
	socket,
	bookingId,
	isMentor,
	menteeId,
}) => {
	const [excalidrawAPI, setExcalidrawAPI] =
		useState<ExcalidrawImperativeAPI | null>(null);
	const [hasPermission, setHasPermission] = useState(isMentor);
	const [menteeHasPermission, setMenteeHasPermission] = useState(false);

	// Track the last version of elements we received to avoid broadcast loops
	const lastRemoteVersion = useRef<number>(0);
	const isRemoteUpdate = useRef(false);

	// Permission Sync
	useEffect(() => {
		if (!socket) return;

		const handlePermission = (payload: { allow: boolean }) => {
			if (!isMentor) {
				setHasPermission(payload.allow);
				toast.info(
					payload.allow
						? "Mentor granted you drawing access"
						: "Mentor revoked drawing access",
				);
			}
		};

		socket.on("whiteboard:permission", handlePermission);
		return () => {
			socket.off("whiteboard:permission", handlePermission);
		};
	}, [socket, isMentor]);

	// Whiteboard Content Sync
	useEffect(() => {
		if (!socket || !excalidrawAPI) return;

		const handleSync = ({
			update,
		}: {
			update: readonly ExcalidrawElement[];
		}) => {
			if (!update) return;

			// Mark this as a remote update to avoid emitting it back
			isRemoteUpdate.current = true;

			excalidrawAPI.updateScene({
				elements: update,
				commitToHistory: false,
			});

			// Reset flag after a short delay or after the update cycle
			setTimeout(() => {
				isRemoteUpdate.current = false;
			}, 100);
		};

		socket.on("whiteboard:sync", handleSync);
		return () => {
			socket.off("whiteboard:sync", handleSync);
		};
	}, [socket, excalidrawAPI]);

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

	const handleChange = useCallback(
		(elements: readonly ExcalidrawElement[]) => {
			if (!socket || !hasPermission || isRemoteUpdate.current) return;

			// Emit the sync event
			socket.emit("whiteboard:sync", {
				bookingId,
				update: elements,
			});
		},
		[socket, bookingId, hasPermission],
	);

	return (
		<div className="absolute inset-0 z-20 bg-white flex flex-col overflow-hidden">
			{/* Toolbar Header */}
			<div className="h-14 bg-white border-b border-slate-200 px-6 flex-shrink-0 flex items-center justify-between shadow-sm z-30">
				<div className="flex items-center gap-3">
					<div className="p-2 bg-primary/10 rounded-lg">
						<MousePointer2 className="w-5 h-5 text-primary" />
					</div>
					<div>
						<h3 className="font-semibold text-slate-800 text-sm">
							Collaborative Whiteboard
						</h3>
						<p className="text-[10px] text-slate-500 flex items-center gap-1">
							<Users className="w-3 h-3" />
							{hasPermission ? "You have drawing access" : "View only mode"}
						</p>
					</div>
				</div>

				{isMentor && (
					<div className="flex items-center gap-2">
						<Button
							size="sm"
							variant={menteeHasPermission ? "default" : "secondary"}
							onClick={togglePermission}
							className="h-9 gap-2 shadow-sm"
						>
							{menteeHasPermission ? (
								<Lock className="w-4 h-4" />
							) : (
								<Unlock className="w-4 h-4" />
							)}
							<span className="hidden md:inline">
								{menteeHasPermission ? "Lock Mentee" : "Unlock Mentee"}
							</span>
						</Button>
					</div>
				)}
			</div>

			{/* Excalidraw Canvas */}
			<div className="flex-1 w-full relative">
				<Excalidraw
					excalidrawAPI={(api) => setExcalidrawAPI(api)}
					onChange={handleChange}
					viewModeEnabled={!hasPermission}
					theme="light"
					gridModeEnabled={true}
					UIOptions={{
						canvasActions: {
							loadScene: false,
							saveToActiveFile: false,
							export: false,
							saveAsImage: true,
						},
					}}
				/>
			</div>
		</div>
	);
};

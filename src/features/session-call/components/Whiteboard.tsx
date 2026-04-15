import type React from "react";
import { useEffect, useState, useRef, useCallback } from "react";
import { Excalidraw, CaptureUpdateAction } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type { Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Users, Lock, Unlock, MousePointer2 } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/app/contexts/ThemeContext";

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
	const { isDarkMode } = useTheme();
	const [excalidrawAPI, setExcalidrawAPI] =
		useState<ExcalidrawImperativeAPI | null>(null);
	const [hasPermission, setHasPermission] = useState(isMentor);
	const [menteeHasPermission, setMenteeHasPermission] = useState(false);

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

	const pendingUpdate = useRef<readonly ExcalidrawElement[] | null>(null);

	// Whiteboard Content Sync
	useEffect(() => {
		if (!socket) return;

		const handleSync = ({
			update,
		}: {
			update: readonly ExcalidrawElement[];
		}) => {
			console.log(
				"[Whiteboard] Received sync update:",
				update?.length,
				"elements",
			);
			if (!update) return;

			if (excalidrawAPI) {
				console.log("[Whiteboard] Applying update immediately");
				isRemoteUpdate.current = true;
				excalidrawAPI.updateScene({
					elements: update,
					captureUpdate: CaptureUpdateAction.NEVER,
				});
				setTimeout(() => {
					isRemoteUpdate.current = false;
				}, 100);
			} else {
				console.log("[Whiteboard] API not ready, buffering update");
				pendingUpdate.current = update;
			}
		};

		socket.on("whiteboard:sync", handleSync);
		return () => {
			socket.off("whiteboard:sync", handleSync);
		};
	}, [socket, excalidrawAPI]);

	const isInitialized = useRef(false);

	useEffect(() => {
		if (excalidrawAPI && pendingUpdate.current) {
			console.log(
				"[Whiteboard] Applying buffered update:",
				pendingUpdate.current.length,
				"elements",
			);
			isRemoteUpdate.current = true;
			excalidrawAPI.updateScene({
				elements: pendingUpdate.current,
				captureUpdate: CaptureUpdateAction.NEVER,
			});
			pendingUpdate.current = null;
			isInitialized.current = true;

			setTimeout(() => {
				isRemoteUpdate.current = false;
			}, 100);
		} else if (excalidrawAPI) {
			const timer = setTimeout(() => {
				isInitialized.current = true;
			}, 1000);
			return () => clearTimeout(timer);
		}
	}, [excalidrawAPI]);

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

			if (elements.length === 0 && !isInitialized.current) return;

			// Emit the sync event
			socket.emit("whiteboard:sync", {
				bookingId,
				update: elements,
			});
		},
		[socket, bookingId, hasPermission],
	);

	return (
		<div className="absolute inset-0 z-20 bg-white dark:bg-[#121212] flex flex-col overflow-hidden transition-colors duration-200">
			{/* Toolbar Header */}
			<div className="h-14 bg-white dark:bg-[#121212] border-b border-slate-200 dark:border-slate-800 px-6 flex-shrink-0 flex items-center justify-between shadow-sm z-30 transition-colors duration-200">
				<div className="flex items-center gap-3">
					<div className="p-2 bg-primary/10 rounded-lg">
						<MousePointer2 className="w-5 h-5 text-primary" />
					</div>
					<div>
						<h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
							Collaborative Whiteboard
						</h3>
						<p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
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
								{menteeHasPermission
									? "Revoke Edit Access"
									: "Permit Edit Access"}
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
					theme={isDarkMode ? "dark" : "light"}
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

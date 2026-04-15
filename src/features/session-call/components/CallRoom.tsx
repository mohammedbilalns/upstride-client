import { Maximize2, Pin, Loader2 } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useSocket } from "@/app/contexts/SocketContext";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { useWebRTC } from "../hooks/use-webrtc";
import { CallControls } from "./CallControls";
import { Whiteboard } from "./Whiteboard";
import { useChat } from "../hooks/use-chat";
import { ChatPanel } from "./ChatPanel";
import { useRouter } from "@tanstack/react-router";

interface CallRoomProps {
	bookingId: string;
	isMentor: boolean;
	menteeId?: string;
	localParticipantName: string;
	remoteParticipantName: string;
}

export const CallRoom: React.FC<CallRoomProps> = ({
	bookingId,
	isMentor,
	menteeId,
	localParticipantName,
	remoteParticipantName,
}) => {
	const { socket } = useSocket();

	const [isWaiting, setIsWaiting] = useState(true);
	const [isWhiteboardActive, setIsWhiteboardActive] = useState(false);
	const [pinnedViewId, setPinnedViewId] = useState<string | null>(null);
	const [showStopScreenShareConfirm, setShowStopScreenShareConfirm] =
		useState(false);
	const [showTerminateConfirm, setShowTerminateConfirm] = useState(false);
	const [isTerminating, setIsTerminating] = useState(false);
	const [isChatOpen, setIsChatOpen] = useState(false);

	const router = useRouter();
	const currentUserId = router.options.context?.auth?.user?.id;

	const { messages, sendMessage, hasUnread, clearUnread } = useChat(
		bookingId,
		socket,
		currentUserId,
		(msg) => {
			if (!isChatOpen) {
				toast.info(`New message from ${remoteLabel}`, {
					description:
						msg.message.length > 50
							? `${msg.message.substring(0, 50)}...`
							: msg.message,
					action: {
						label: "Open Chat",
						onClick: () => {
							setIsChatOpen(true);
							clearUnread();
						},
					},
				});
			}
		},
	);

	const navigateToSessionList = () => {
		window.location.assign(isMentor ? "/mentor-sessions" : "/sessions");
	};
	const localLabel = localParticipantName.trim() || "You";
	const remoteLabel = remoteParticipantName.trim() || "Participant";

	//	const localVideoRef = useRef<HTMLVideoElement>(null);
	//	const remoteVideoRef = useRef<HTMLVideoElement>(null);

	const {
		localStream,
		localScreenStream,
		remoteVideoStream,
		remoteScreenStream,
		isCamOn,
		isMicOn,
		isScreenSharing,
		isRemoteScreenSharing,
		isRemoteCamOn,
		isRemoteMicOn,
		toggleCam,
		toggleMic,
		toggleScreenShare,
		leaveSession,
	} = useWebRTC(bookingId, socket);

	//const localScreenVideoRef = useRef<HTMLVideoElement>(null);
	//	const remoteScreenVideoRef = useRef<HTMLVideoElement>(null);

	// Clear waiting state when remote stream is received
	useEffect(() => {
		setIsWaiting(!remoteVideoStream);
	}, [remoteVideoStream]);

	useEffect(() => {
		if (!socket) return;

		console.log("[CallRoom] Joining call room", bookingId);
		socket.emit("call:join", { bookingId });

		const handleUserJoined = () => {
			setIsWaiting(false);
			toast.success(`${remoteLabel} joined the call.`);
		};

		const handleUserLeft = () => {
			setIsWaiting(true);
			setIsWhiteboardActive(false);
			setPinnedViewId("REMOTE_CAM");
			toast.info(`${remoteLabel} left the call. Waiting for him to rejoin...`);
		};

		const handleTerminated = () => {
			setIsTerminating(false);
			setShowTerminateConfirm(false);
			toast.info(
				isMentor
					? "Session terminated successfully."
					: "Session has been terminated by the mentor.",
			);
			navigateToSessionList();
		};

		socket.on("call:user-joined", handleUserJoined);
		socket.on("call:user-left", handleUserLeft);
		socket.on("call:terminated", handleTerminated);

		return () => {
			leaveSession();
			socket.emit("call:leave", { bookingId });
			socket.off("call:user-joined", handleUserJoined);
			socket.off("call:user-left", handleUserLeft);
			socket.off("call:terminated", handleTerminated);
		};
	}, [socket, bookingId, isMentor, leaveSession, remoteLabel]);

	useEffect(() => {
		if (!socket) return;

		const handleSocketError = () => {
			setIsTerminating(false);
		};

		socket.on("socket:error", handleSocketError);

		return () => {
			socket.off("socket:error", handleSocketError);
		};
	}, [socket]);

	useEffect(() => {
		const handlePageExit = () => {
			leaveSession();
		};

		window.addEventListener("pagehide", handlePageExit);
		window.addEventListener("beforeunload", handlePageExit);

		return () => {
			window.removeEventListener("pagehide", handlePageExit);
			window.removeEventListener("beforeunload", handlePageExit);
		};
	}, [leaveSession]);

	const handleLeaveSession = () => {
		leaveSession();
		socket?.emit("call:leave", { bookingId });
		navigateToSessionList();
	};

	const handleTerminateSession = () => {
		if (!socket) return;
		setIsTerminating(true);
		socket.emit("call:terminate", { bookingId });
	};

	// Auto-select pinned view if none is pinned
	useEffect(() => {
		// If whiteboard is active, it MUST be the pinned view if it's the main focus
		if (isWhiteboardActive) {
			if (pinnedViewId !== "WHITEBOARD") setPinnedViewId("WHITEBOARD");
			return;
		}

		// Handle unpinning if the currently pinned screen is no longer sharing
		if (pinnedViewId === "REMOTE_SCREEN" && !isRemoteScreenSharing) {
			setPinnedViewId("REMOTE_CAM");
		}
		if (pinnedViewId === "LOCAL_SCREEN" && !isScreenSharing) {
			setPinnedViewId("REMOTE_CAM");
		}

		if (
			!pinnedViewId ||
			pinnedViewId === "WHITEBOARD" ||
			(pinnedViewId === "REMOTE_CAM" && isWaiting)
		) {
			if (isRemoteScreenSharing) setPinnedViewId("REMOTE_SCREEN");
			else if (isScreenSharing) setPinnedViewId("LOCAL_SCREEN");
			else if (!pinnedViewId) setPinnedViewId("REMOTE_CAM");
		}
	}, [
		isRemoteScreenSharing,
		isScreenSharing,
		pinnedViewId,
		isWhiteboardActive,
		isWaiting,
	]);

	const handleToggleWhiteboard = () => {
		setIsWhiteboardActive((prev) => {
			const next = !prev;
			if (next) {
				setPinnedViewId("WHITEBOARD");
			} else if (pinnedViewId === "WHITEBOARD") {
				// Determine what to show instead
				if (isRemoteScreenSharing) setPinnedViewId("REMOTE_SCREEN");
				else if (isScreenSharing) setPinnedViewId("LOCAL_SCREEN");
				else setPinnedViewId("REMOTE_CAM");
			}
			return next;
		});
	};

	const handlePinView = (viewId: string) => {
		if (viewId !== "WHITEBOARD" && isWhiteboardActive) {
			setIsWhiteboardActive(false);
		}
		setPinnedViewId(viewId);
	};

	const handleToggleScreenShare = () => {
		if (isScreenSharing) {
			setShowStopScreenShareConfirm(true);
		} else {
			toggleScreenShare();
		}
	};

	const confirmStopScreenShare = () => {
		toggleScreenShare();
		setShowStopScreenShareConfirm(false);
	};

	const isCollaborationActive =
		!isWaiting &&
		(isWhiteboardActive || isScreenSharing || isRemoteScreenSharing);

	return (
		<div className="flex h-[calc(100vh-4rem)] w-full bg-slate-950 relative overflow-hidden text-slate-50">
			{/* Main Content Area */}
			<div className="flex-1 flex flex-col relative z-0 min-w-0">
				<div className="flex-1 relative z-0 overflow-hidden">
					{/* Whiteboard (ALWAYS Persisted - Hidden when not active) */}
					<div
						className={`absolute inset-0 z-10 w-full h-full ${!isCollaborationActive || pinnedViewId !== "WHITEBOARD" ? "hidden" : "block"}`}
					>
						<Whiteboard
							socket={socket}
							bookingId={bookingId}
							isMentor={isMentor}
							menteeId={menteeId}
						/>
					</div>

					<div
						className={`h-full w-full relative z-0 flex flex-col min-h-0 ${isCollaborationActive && pinnedViewId === "WHITEBOARD" ? "invisible pointer-events-none" : ""}`}
					>
						{!isCollaborationActive ? (
							/* Grid Mode */
							<div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
								<VideoCard
									stream={localStream}
									isCamOn={isCamOn}
									label={localLabel}
									roleIndicator={isMentor ? "Mentor" : undefined}
									isMicOn={isMicOn}
									isLocal
									onPin={() => {}} // Pin disabled in grid mode
									isPinned
								/>
								<div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/50 flex items-center justify-center shadow-2xl">
									{isWaiting ? (
										<div className="flex flex-col items-center justify-center text-slate-400 p-8 text-center">
											<Loader2 className="h-12 w-12 animate-spin mb-4 text-primary" />
											<h3 className="text-xl font-semibold mb-2 text-slate-100">
												Waiting for the other person to join...
											</h3>
											<p className="max-w-xs text-sm">
												They have been notified and should be here shortly.
											</p>
										</div>
									) : (
										<VideoCard
											stream={remoteVideoStream}
											isCamOn={isRemoteCamOn}
											label={remoteLabel}
											roleIndicator={!isMentor ? "Mentor" : undefined}
											isMicOn={isRemoteMicOn}
											onPin={() => {}} // Pin disabled in grid mode
											isPinned
										/>
									)}
								</div>
							</div>
						) : (
							/* Collaboration Mode (Stage + Strip) */
							<div className="flex-1 flex flex-col relative min-h-0 h-full">
								{/* Main Stage */}
								<div className="flex-1 relative m-4 rounded-3xl overflow-hidden border border-slate-800/50 bg-slate-900 shadow-2xl flex items-center justify-center">
									{/* Whiteboard placeholder (actual whiteboard is layered above via absolute positioning) */}
									{pinnedViewId === "WHITEBOARD" && (
										<div className="absolute inset-0 bg-slate-950" />
									)}

									{/* Remote Screen */}
									{pinnedViewId === "REMOTE_SCREEN" &&
										isRemoteScreenSharing && (
											<video
												ref={(ref) => {
													if (ref) ref.srcObject = remoteScreenStream;
												}}
												autoPlay
												playsInline
												className="w-full h-full object-contain bg-black"
											/>
										)}

									{/* Local Screen */}
									{pinnedViewId === "LOCAL_SCREEN" && isScreenSharing && (
										<video
											ref={(ref) => {
												if (ref) ref.srcObject = localScreenStream;
											}}
											autoPlay
											playsInline
											muted
											className="w-full h-full object-contain bg-black"
										/>
									)}

									{/* Remote Cam */}
									{pinnedViewId === "REMOTE_CAM" && !isWaiting && (
										<VideoCard
											stream={remoteVideoStream}
											isCamOn={isRemoteCamOn}
											label={remoteLabel}
											roleIndicator={!isMentor ? "Mentor" : undefined}
											isMicOn={isRemoteMicOn}
											onPin={() => handlePinView("REMOTE_CAM")}
											isPinned
										/>
									)}

									{/* Local Cam */}
									{pinnedViewId === "LOCAL_CAM" && (
										<VideoCard
											stream={localStream}
											isCamOn={isCamOn}
											label={localLabel}
											roleIndicator={isMentor ? "Mentor" : undefined}
											isMicOn={isMicOn}
											isLocal
											onPin={() => handlePinView("LOCAL_CAM")}
											isPinned
										/>
									)}

									{/* Waiting Screen as Main View */}
									{pinnedViewId === "REMOTE_CAM" && isWaiting && (
										<div className="flex flex-col items-center justify-center text-slate-400 p-8 text-center">
											<Loader2 className="h-12 w-12 animate-spin mb-4 text-primary" />
											<h3 className="text-xl font-semibold mb-2 text-slate-100">
												Waiting for the other person to join...
											</h3>
											<p className="max-w-xs text-sm">
												They have been notified and should be here shortly.
											</p>
										</div>
									)}
								</div>

								{/* Thumbnail Strip */}
								<div className="h-40 px-6 pb-20 flex gap-4 justify-center items-end pointer-events-none mb-4">
									{/* Local Cam Thumbnail */}
									{pinnedViewId !== "LOCAL_CAM" && (
										<div className="pointer-events-auto h-full aspect-video shadow-2xl">
											<VideoCard
												stream={localStream}
												isCamOn={isCamOn}
												label={localLabel}
												roleIndicator={isMentor ? "Mentor" : undefined}
												isMicOn={isMicOn}
												isLocal
												isThumbnail
												onPin={() => handlePinView("LOCAL_CAM")}
											/>
										</div>
									)}

									{/* Remote Cam/Waiting Thumbnail */}
									{pinnedViewId !== "REMOTE_CAM" && (
										<div className="pointer-events-auto h-full aspect-video shadow-2xl">
											{isWaiting ? (
												<div className="h-full w-full rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-2 text-[10px] text-slate-500">
													<Loader2 className="h-4 w-4 animate-spin mb-1" />
													<span className="text-center">Waiting...</span>
													<Button
														size="icon"
														variant="ghost"
														className="h-6 w-6 mt-1"
														onClick={() => handlePinView("REMOTE_CAM")}
													>
														<Maximize2 className="h-3.5 w-3.5" />
													</Button>
												</div>
											) : (
												<VideoCard
													stream={remoteVideoStream}
													isCamOn={isRemoteCamOn}
													label={remoteLabel}
													roleIndicator={!isMentor ? "Mentor" : undefined}
													isMicOn={isRemoteMicOn}
													isThumbnail
													onPin={() => handlePinView("REMOTE_CAM")}
												/>
											)}
										</div>
									)}

									{/* Local Screen Thumbnail */}
									{pinnedViewId !== "LOCAL_SCREEN" && isScreenSharing && (
										<div className="pointer-events-auto h-full aspect-video shadow-2xl relative rounded-xl overflow-hidden border border-slate-700">
											<video
												ref={(ref) => {
													if (ref) ref.srcObject = localScreenStream;
												}}
												autoPlay
												playsInline
												muted
												className="w-full h-full object-cover"
											/>
											<div className="absolute top-2 right-2 z-20">
												<Button
													size="icon"
													variant="secondary"
													className="h-7 w-7 bg-black/50 hover:bg-black/80 backdrop-blur-md"
													onClick={() => handlePinView("LOCAL_SCREEN")}
												>
													<Maximize2 className="h-4 w-4" />
												</Button>
											</div>
											<div className="absolute bottom-2 left-2 bg-black/50 px-2 py-0.5 rounded text-[10px] backdrop-blur-md">
												Your Screen
											</div>
										</div>
									)}

									{/* Remote Screen Thumbnail */}
									{pinnedViewId !== "REMOTE_SCREEN" &&
										isRemoteScreenSharing && (
											<div className="pointer-events-auto h-full aspect-video shadow-2xl relative rounded-xl overflow-hidden border border-slate-700">
												<video
													ref={(ref) => {
														if (ref) ref.srcObject = remoteScreenStream;
													}}
													autoPlay
													playsInline
													className="w-full h-full object-cover"
												/>
												<div className="absolute top-2 right-2 z-20">
													<Button
														size="icon"
														variant="secondary"
														className="h-7 w-7 bg-black/50 hover:bg-black/80 backdrop-blur-md"
														onClick={() => handlePinView("REMOTE_SCREEN")}
													>
														<Maximize2 className="h-4 w-4" />
													</Button>
												</div>
												<div className="absolute bottom-2 left-2 bg-black/50 px-2 py-0.5 rounded text-[10px] backdrop-blur-md">
													Remote Screen
												</div>
											</div>
										)}
								</div>
							</div>
						)}
					</div>
				</div>

				<CallControls
					isCamOn={isCamOn}
					isMicOn={isMicOn}
					isScreenSharing={isScreenSharing}
					isWhiteboardActive={isWhiteboardActive}
					isMentor={isMentor}
					onToggleCam={toggleCam}
					onToggleMic={toggleMic}
					onToggleScreenShare={handleToggleScreenShare}
					onToggleWhiteboard={handleToggleWhiteboard}
					onLeave={handleLeaveSession}
					onTerminate={() => setShowTerminateConfirm(true)}
					onToggleChat={() => {
						setIsChatOpen(!isChatOpen);
						if (!isChatOpen) clearUnread();
					}}
					isChatOpen={isChatOpen}
					hasUnreadChat={hasUnread}
				/>
			</div>

			{/* Chat Side Panel */}
			{isChatOpen && (
				<div className="w-80 md:w-96 flex-shrink-0 animate-in slide-in-from-right duration-300">
					<ChatPanel
						messages={messages}
						onSendMessage={sendMessage}
						onClose={() => setIsChatOpen(false)}
						remoteParticipantName={remoteLabel}
					/>
				</div>
			)}

			<ConfirmModal
				isOpen={showStopScreenShareConfirm}
				onClose={() => setShowStopScreenShareConfirm(false)}
				onConfirm={confirmStopScreenShare}
				title="Stop Screen Sharing?"
				message="This will stop sharing your screen with the other participant."
				confirmText="Stop Sharing"
				variant="destructive"
			/>

			<ConfirmModal
				isOpen={showTerminateConfirm}
				onClose={() => setShowTerminateConfirm(false)}
				onConfirm={handleTerminateSession}
				title="Terminate Session?"
				message="This will permanently end the session and mark it as completed. You will not be able to rejoin."
				confirmText={isTerminating ? "Terminating..." : "Terminate"}
				variant="destructive"
			/>
		</div>
	);
};

interface VideoCardProps {
	stream: MediaStream | null;
	isCamOn: boolean;
	label: string;
	roleIndicator?: string;
	isMicOn: boolean;
	isLocal?: boolean;
	isThumbnail?: boolean;
	isPinned?: boolean;
	onPin: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({
	stream,
	isCamOn,
	label,
	roleIndicator,
	isMicOn,
	isLocal,
	isThumbnail,
	isPinned,
	onPin,
}) => {
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (videoRef.current && stream) {
			videoRef.current.srcObject = stream;
		}
	}, [stream]);

	return (
		<div
			className={`relative group rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/50 flex items-center justify-center shadow-xl transition-all duration-300 ${isThumbnail ? "h-full w-full" : "w-full h-full"}`}
		>
			<video
				ref={videoRef}
				autoPlay
				playsInline
				muted={isLocal}
				className={`w-full h-full object-cover ${!isCamOn ? "invisible" : ""}`}
				style={{ transform: isLocal ? "scaleX(-1)" : "none" }}
			/>

			{/* Pin Button */}
			{!isPinned && (
				<div
					className={`absolute top-2 right-2 transition-opacity duration-200 ${isThumbnail ? "opacity-100" : "group-hover:opacity-100 opacity-0"}`}
				>
					<Button
						size="icon"
						variant="secondary"
						onClick={(e) => {
							e.stopPropagation();
							onPin();
						}}
						className={`bg-black/40 hover:bg-black/70 border-white/10 backdrop-blur-md ${isThumbnail ? "h-7 w-7" : "h-9 w-9"}`}
					>
						<Pin className={`${isThumbnail ? "h-3.5 w-3.5" : "h-5 w-5"}`} />
					</Button>
				</div>
			)}

			{!isCamOn && (
				<div
					className={`absolute inset-0 flex items-center justify-center bg-slate-900 text-slate-400 font-medium ${isThumbnail ? "text-xs" : "text-lg"}`}
				>
					<div className="flex flex-col items-center gap-2">
						<div
							className={`${isThumbnail ? "w-8 h-8" : "w-12 h-12"} rounded-full bg-slate-800 flex items-center justify-center text-slate-100 font-bold`}
						>
							{label.charAt(0)}
						</div>
						<span className="opacity-60">Camera Off</span>
					</div>
				</div>
			)}
			<div
				className={`absolute bottom-3 left-3 bg-slate-950/60 text-slate-100 px-3 py-1 rounded-lg ${isThumbnail ? "text-[10px]" : "text-xs"} backdrop-blur-md border border-white/5 flex items-center gap-2`}
			>
				<span>{label}</span>
				{roleIndicator && (
					<span className="rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-200">
						{roleIndicator}
					</span>
				)}
				{!isMicOn && <span className="text-rose-400 font-bold">MUTED</span>}
			</div>
		</div>
	);
};

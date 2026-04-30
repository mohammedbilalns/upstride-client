import { useForm } from "@tanstack/react-form";
import { useRouter } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useSocket } from "@/app/contexts/SocketContext";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import FieldError from "@/components/common/FieldError";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { feedbackFormSchema } from "@/features/session-booking/validators/feedback.schema";
import { playNotificationSound } from "@/shared/utils/audio";
import { getErrorMessage } from "@/shared/utils/formValidation";
import { useChat } from "../hooks/useChat";
import { useWebRTC } from "../hooks/useWebrtc";
import type { CallEndPayload } from "../types/call-events";
import { CallControls } from "./CallControls";
import { ChatPanel } from "./ChatPanel";
import { CollaborationStage } from "./CollaborationStage";
import { SessionGrid } from "./SessionGrid";
import { ThumbnailStrip } from "./ThumbnailStrip";
import { Whiteboard } from "./Whiteboard";

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
	const [joinError, setJoinError] = useState<string | null>(null);
	const [isAuthorized, setIsAuthorized] = useState(false);
	const [isValidating, setIsValidating] = useState(true);
	const hasSentLeaveRef = useRef(false);

	const router = useRouter();
	const currentUserId = router.options.context?.auth?.user?.id;
	const terminateForm = useForm({
		defaultValues: {
			bookingId,
			feedback: "",
		},
		onSubmit: async ({ value }) => {
			if (!socket) return;
			setIsTerminating(true);
			const payload: CallEndPayload = {
				bookingId: value.bookingId,
				feedback: value.feedback,
			};
			socket.emit("call:terminate", payload);
		},
		validators: {
			onSubmit: feedbackFormSchema
				.partial({ feedback: true })
				.superRefine((value, ctx) => {
					if (value.feedback === "") {
						return;
					}
					if (value.feedback && value.feedback.length < 10) {
						ctx.addIssue({
							code: "custom",
							path: ["feedback"],
							message: "Feedback must be atleast 10 characters",
						});
					}
					if (value.feedback && value.feedback.length > 1000) {
						ctx.addIssue({
							code: "custom",
							path: ["feedback"],
							message: "Feedback must be less than 1000 characters",
						});
					}
				}),
		},
	});

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
		if (isMentor) {
			router.navigate({
				to: "/mentor-sessions",
				search: {
					page: 1,
					limit: 10,
					filter: "upcoming",
				},
			});
		} else {
			router.navigate({
				to: "/sessions",
				search: {
					page: 1,
					limit: 10,
					tab: "upcoming",
					upcomingFilter: "upcoming",
					pastFilter: "completed",
				},
			});
		}
	};
	const localLabel = localParticipantName.trim() || "You";
	const remoteLabel = remoteParticipantName.trim() || "Participant";

	const emitLeaveOnce = () => {
		if (!socket || hasSentLeaveRef.current) return;
		hasSentLeaveRef.current = true;
		socket.emit("call:leave", { bookingId });
	};

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
	} = useWebRTC(bookingId, socket, isAuthorized && !joinError);

	// Clear waiting state when remote stream is received
	useEffect(() => {
		setIsWaiting(!remoteVideoStream);
	}, [remoteVideoStream]);

	useEffect(() => {
		if (!socket) return;

		console.log("[CallRoom] Initiating pre-join check", bookingId);
		socket.emit("call:pre-join-check", { bookingId });

		const handlePreJoinSuccess = () => {
			console.log("[CallRoom] Pre-join check successful", bookingId);
			setJoinError(null);
			setIsAuthorized(true);
			setIsValidating(false);
			socket.emit("call:join", { bookingId });
		};

		const handleUserJoined = () => {
			setIsWaiting(false);
			playNotificationSound();
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
			terminateForm.reset({
				bookingId,
				feedback: "",
			});
			toast.info(
				isMentor
					? "Session terminated successfully."
					: "Session has been terminated by the mentor.",
			);
			navigateToSessionList();
		};

		socket.on("call:pre-join-check:success", handlePreJoinSuccess);
		socket.on("call:user-joined", handleUserJoined);
		socket.on("call:user-left", handleUserLeft);
		socket.on("call:terminated", handleTerminated);

		return () => {
			leaveSession();
			emitLeaveOnce();
			socket.off("call:pre-join-check:success", handlePreJoinSuccess);
			socket.off("call:user-joined", handleUserJoined);
			socket.off("call:user-left", handleUserLeft);
			socket.off("call:terminated", handleTerminated);
		};
	}, [socket, bookingId, isMentor, leaveSession, remoteLabel]);

	useEffect(() => {
		if (!socket) return;

		const handleSocketError = (err: { message: string }) => {
			setIsTerminating(false);
			setIsValidating(false);
			if (
				err.message?.includes("Session has not started yet") ||
				err.message?.includes("5 minutes before the start time")
			) {
				setJoinError(err.message || "Session has not started yet.");
				return;
			}

			if (err.message) {
				toast.error(err.message);
			}
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
		emitLeaveOnce();
		navigateToSessionList();
	};

	const handleTerminateSession = () => {
		const currentFeedback = terminateForm.state.values.feedback;
		if (currentFeedback === "") {
			setIsTerminating(true);
			socket?.emit("call:terminate", { bookingId });
			return;
		}
		void terminateForm.handleSubmit();
	};

	// Auto-select pinned view if none is pinned
	useEffect(() => {
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

	if (isValidating) {
		return (
			<div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] w-full bg-background text-foreground p-6">
				<div className="max-w-md w-full space-y-6 text-center animate-in fade-in duration-500">
					<div className="relative mx-auto w-16 h-16 flex items-center justify-center rounded-2xl bg-muted border border-border">
						<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
					</div>
					<div className="space-y-2">
						<h2 className="text-xl font-medium tracking-tight">
							Verifying Session...
						</h2>
						<p className="text-muted-foreground text-sm italic">
							Hang tight, we're getting things ready for you.
						</p>
					</div>
				</div>
			</div>
		);
	}

	if (joinError) {
		return (
			<div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] w-full bg-background text-foreground p-6">
				<div className="max-w-md w-full space-y-8 text-center animate-in fade-in zoom-in duration-500">
					<div className="relative mx-auto w-24 h-24 flex items-center justify-center rounded-3xl bg-rose-500/10 text-rose-500 border border-rose-500/20">
						<AlertCircle className="h-12 w-12" />
						<div className="absolute inset-0 rounded-3xl bg-rose-500/5 animate-pulse" />
					</div>

					<div className="space-y-3">
						<h2 className="text-3xl font-bold tracking-tight">
							Access Restricted
						</h2>
						<p className="text-muted-foreground leading-relaxed">{joinError}</p>
					</div>

					<div className="pt-4">
						<Button
							onClick={navigateToSessionList}
							variant="outline"
							className="rounded-2xl px-8 h-12 gap-2"
						>
							<ArrowLeft className="h-4 w-4" />
							Back to Sessions
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex h-[calc(100vh-4rem)] w-full bg-background relative overflow-hidden text-foreground">
			{/* Main Content Area */}
			<div className="flex-1 flex flex-col relative z-0 min-w-0">
				<div className="flex-1 relative z-0 overflow-hidden">
					{/* Whiteboard  */}
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
							<SessionGrid
								localStream={localStream}
								remoteVideoStream={remoteVideoStream}
								isCamOn={isCamOn}
								isRemoteCamOn={isRemoteCamOn}
								localLabel={localLabel}
								remoteLabel={remoteLabel}
								isMentor={isMentor}
								isMicOn={isMicOn}
								isRemoteMicOn={isRemoteMicOn}
								isWaiting={isWaiting}
							/>
						) : (
							<div className="flex-1 flex flex-col relative min-h-0 h-full">
								<CollaborationStage
									pinnedViewId={pinnedViewId}
									isWaiting={isWaiting}
									remoteScreenStream={remoteScreenStream}
									localScreenStream={localScreenStream}
									remoteVideoStream={remoteVideoStream}
									localStream={localStream}
									isRemoteCamOn={isRemoteCamOn}
									isCamOn={isCamOn}
									remoteLabel={remoteLabel}
									localLabel={localLabel}
									isMentor={isMentor}
									isMicOn={isMicOn}
									isRemoteMicOn={isRemoteMicOn}
									isScreenSharing={isScreenSharing}
									isRemoteScreenSharing={isRemoteScreenSharing}
									onPinView={handlePinView}
								/>

								<ThumbnailStrip
									pinnedViewId={pinnedViewId}
									isWaiting={isWaiting}
									localStream={localStream}
									remoteVideoStream={remoteVideoStream}
									localScreenStream={localScreenStream}
									remoteScreenStream={remoteScreenStream}
									isCamOn={isCamOn}
									isRemoteCamOn={isRemoteCamOn}
									isMicOn={isMicOn}
									isRemoteMicOn={isRemoteMicOn}
									isScreenSharing={isScreenSharing}
									isRemoteScreenSharing={isRemoteScreenSharing}
									localLabel={localLabel}
									remoteLabel={remoteLabel}
									isMentor={isMentor}
									onPinView={handlePinView}
								/>
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

			{/* Chat Panel */}
			{isChatOpen && (
				<div className="absolute inset-0 z-30 animate-in slide-in-from-right duration-300 md:relative md:inset-auto md:z-auto md:w-96 md:shrink-0">
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
				onClose={() => {
					setShowTerminateConfirm(false);
					terminateForm.reset({
						bookingId,
						feedback: "",
					});
				}}
				onConfirm={handleTerminateSession}
				title="Terminate Session?"
				message="This will permanently end the session and mark it as completed. You will not be able to rejoin."
				confirmText={isTerminating ? "Terminating..." : "Terminate"}
				variant="destructive"
			>
				<div className="mt-4 space-y-2">
					<terminateForm.Field name="feedback">
						{(field) => (
							<div className="space-y-2">
								<label htmlFor={field.name} className="text-sm font-medium">
									Feedback for mentee
								</label>
								<Textarea
									id={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									placeholder=" write at least 10 characters..."
									className="min-h-25 resize-none"
									maxLength={1000}
								/>
								<FieldError
									message={getErrorMessage(field.state.meta.errors?.[0])}
								/>
							</div>
						)}
					</terminateForm.Field>
				</div>
			</ConfirmModal>
		</div>
	);
};

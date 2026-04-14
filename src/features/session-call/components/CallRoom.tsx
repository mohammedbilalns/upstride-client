import { useRouter } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useSocket } from "@/app/contexts/SocketContext";
import { useWebRTC } from "../hooks/use-webrtc";
import { CallControls } from "./CallControls";
import { Whiteboard } from "./Whiteboard";

interface CallRoomProps {
	bookingId: string;
	isMentor: boolean;
	menteeId?: string;
}

export const CallRoom: React.FC<CallRoomProps> = ({
	bookingId,
	isMentor,
	menteeId,
}) => {
	const { socket } = useSocket();
	const router = useRouter();

	const [isWaiting, setIsWaiting] = useState(true);
	const [isWhiteboardActive, setIsWhiteboardActive] = useState(false);

	const localVideoRef = useRef<HTMLVideoElement>(null);
	const remoteVideoRef = useRef<HTMLVideoElement>(null);

	const {
		localStream,
		remoteStream,
		isCamOn,
		isMicOn,
		isScreenSharing,
		isRemoteCamOn,
		isRemoteMicOn,
		toggleCam,
		toggleMic,
		toggleScreenShare,
	} = useWebRTC(bookingId, socket);

	useEffect(() => {
		if (localVideoRef.current && localStream) {
			localVideoRef.current.srcObject = localStream;
		}
	}, [localStream]);

	useEffect(() => {
		if (remoteVideoRef.current && remoteStream) {
			remoteVideoRef.current.srcObject = remoteStream;
			setIsWaiting(false);
		}
	}, [remoteStream]);

	useEffect(() => {
		if (!socket) return;

		socket.emit("call:join", { bookingId });

		socket.on("call:user-joined", () => {
			setIsWaiting(false);
			toast.success("Other person joined!");
		});

		socket.on("call:user-left", () => {
			setIsWaiting(true);
			toast.info("Other person disconnected. Waiting for them to rejoin...");
		});

		socket.on("call:terminated", () => {
			toast.info("Session has been terminated by the mentor.");
			router.navigate({ to: isMentor ? "/mentor/sessions" : "/sessions" });
		});

		return () => {
			socket.emit("call:leave", { bookingId });
			socket.off("call:user-joined");
			socket.off("call:user-left");
			socket.off("call:terminated");
		};
	}, [socket, bookingId, router, isMentor]);

	const handleEndCall = () => {
		if (isMentor) {
			socket?.emit("call:terminate", { bookingId });
		}
		router.navigate({ to: isMentor ? "/mentor/sessions" : "/sessions" });
	};

	return (
		<div className="flex flex-col h-[calc(100vh-4rem)] w-full bg-background relative overflow-hidden">
			{/* Call Grid */}
			<div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 gap-4 relative z-0">
				{/* Local User */}
				<div className="relative rounded-2xl overflow-hidden bg-muted flex items-center justify-center">
					<video
						ref={localVideoRef}
						autoPlay
						playsInline
						muted
						className={`w-full h-full object-cover ${!isCamOn && !isScreenSharing ? "hidden" : ""}`}
						style={{ transform: isScreenSharing ? "none" : "scaleX(-1)" }}
					/>
					{!isCamOn && !isScreenSharing && (
						<div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white font-medium text-lg">
							Camera Off
						</div>
					)}
					<div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-md">
						You {isMicOn ? "" : "(Muted)"}
					</div>
				</div>

				{/* Remote User / Waiting Screen */}
				<div className="relative rounded-2xl overflow-hidden bg-muted flex items-center justify-center">
					{isWaiting ? (
						<div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center bg-card">
							<Loader2 className="h-12 w-12 animate-spin mb-4 text-primary" />
							<h3 className="text-xl font-semibold mb-2 text-foreground">
								Waiting for the other person to join...
							</h3>
							<p>They have been notified and should be here shortly.</p>
						</div>
					) : (
						<>
							<video
								ref={remoteVideoRef}
								autoPlay
								playsInline
								className={`w-full h-full object-cover ${!isRemoteCamOn ? "hidden" : ""}`}
							/>
							{!isRemoteCamOn && (
								<div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white font-medium text-lg">
									Camera Off
								</div>
							)}
							<div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-md">
								{isMentor ? "Mentee" : "Mentor"}{" "}
								{isRemoteMicOn ? "" : "(Muted)"}
							</div>
						</>
					)}
				</div>
			</div>

			{/* Custom Whiteboard Overlay */}
			{isWhiteboardActive && (
				<div className="absolute inset-x-0 inset-y-0 bottom-24 z-10 m-4 rounded-2xl overflow-hidden border shadow-2xl bg-background/95 backdrop-blur-3xl animate-in fade-in slide-in-from-bottom-8">
					<Whiteboard
						socket={socket}
						bookingId={bookingId}
						isMentor={isMentor}
						menteeId={menteeId}
					/>
				</div>
			)}

			<CallControls
				isCamOn={isCamOn}
				isMicOn={isMicOn}
				isScreenSharing={isScreenSharing}
				isWhiteboardActive={isWhiteboardActive}
				onToggleCam={toggleCam}
				onToggleMic={toggleMic}
				onToggleScreenShare={toggleScreenShare}
				onToggleWhiteboard={() => setIsWhiteboardActive((prev) => !prev)}
				onEndCall={handleEndCall}
			/>
		</div>
	);
};

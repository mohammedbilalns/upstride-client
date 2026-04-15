import type React from "react";
import { useEffect, useRef } from "react";
import { VideoCard } from "./VideoCard";
import { WaitingScreen } from "./WaitingScreen";

interface CollaborationStageProps {
	pinnedViewId: string | null;
	isWaiting: boolean;
	remoteScreenStream: MediaStream | null;
	localScreenStream: MediaStream | null;
	remoteVideoStream: MediaStream | null;
	localStream: MediaStream | null;
	isRemoteCamOn: boolean;
	isCamOn: boolean;
	remoteLabel: string;
	localLabel: string;
	isMentor: boolean;
	isMicOn: boolean;
	isRemoteMicOn: boolean;
	isScreenSharing: boolean;
	isRemoteScreenSharing: boolean;
	onPinView: (viewId: string) => void;
}

export const CollaborationStage: React.FC<CollaborationStageProps> = ({
	pinnedViewId,
	isWaiting,
	remoteScreenStream,
	localScreenStream,
	remoteVideoStream,
	localStream,
	isRemoteCamOn,
	isCamOn,
	remoteLabel,
	localLabel,
	isMentor,
	isMicOn,
	isRemoteMicOn,
	isScreenSharing,
	isRemoteScreenSharing,
	onPinView,
}) => {
	const remoteScreenRef = useRef<HTMLVideoElement>(null);
	const localScreenRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (remoteScreenRef.current && remoteScreenStream) {
			remoteScreenRef.current.srcObject = remoteScreenStream;
		}
	}, [remoteScreenStream]);

	useEffect(() => {
		if (localScreenRef.current && localScreenStream) {
			localScreenRef.current.srcObject = localScreenStream;
		}
	}, [localScreenStream]);

	return (
		<div className="flex-1 relative m-4 rounded-3xl overflow-hidden border border-slate-800/50 bg-slate-900 shadow-2xl flex items-center justify-center">
			{/* Whiteboard placeholder */}
			{pinnedViewId === "WHITEBOARD" && (
				<div className="absolute inset-0 bg-slate-950" />
			)}

			{/* Remote Screen */}
			{pinnedViewId === "REMOTE_SCREEN" && isRemoteScreenSharing && (
				<video
					ref={remoteScreenRef}
					autoPlay
					playsInline
					className="w-full h-full object-contain bg-black"
				/>
			)}

			{/* Local Screen */}
			{pinnedViewId === "LOCAL_SCREEN" && isScreenSharing && (
				<video
					ref={localScreenRef}
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
					onPin={() => onPinView("REMOTE_CAM")}
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
					onPin={() => onPinView("LOCAL_CAM")}
					isPinned
				/>
			)}

			{/* Waiting Screen as Main View */}
			{pinnedViewId === "REMOTE_CAM" && isWaiting && (
				<WaitingScreen remoteLabel={remoteLabel} />
			)}
		</div>
	);
};

import { Maximize2 } from "lucide-react";
import type React from "react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { VideoCard } from "./VideoCard";
import { WaitingScreen } from "./WaitingScreen";

interface ThumbnailStripProps {
	pinnedViewId: string | null;
	isWaiting: boolean;
	localStream: MediaStream | null;
	remoteVideoStream: MediaStream | null;
	localScreenStream: MediaStream | null;
	remoteScreenStream: MediaStream | null;
	isCamOn: boolean;
	isRemoteCamOn: boolean;
	isMicOn: boolean;
	isRemoteMicOn: boolean;
	isScreenSharing: boolean;
	isRemoteScreenSharing: boolean;
	localLabel: string;
	remoteLabel: string;
	isMentor: boolean;
	onPinView: (viewId: string) => void;
}

export const ThumbnailStrip: React.FC<ThumbnailStripProps> = ({
	pinnedViewId,
	isWaiting,
	localStream,
	remoteVideoStream,
	localScreenStream,
	remoteScreenStream,
	isCamOn,
	isRemoteCamOn,
	isMicOn,
	isRemoteMicOn,
	isScreenSharing,
	isRemoteScreenSharing,
	localLabel,
	remoteLabel,
	isMentor,
	onPinView,
}) => {
	return (
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
						onPin={() => onPinView("LOCAL_CAM")}
					/>
				</div>
			)}

			{/* Remote Cam/Waiting Thumbnail */}
			{pinnedViewId !== "REMOTE_CAM" && (
				<div className="pointer-events-auto h-full aspect-video shadow-2xl">
					{isWaiting ? (
						<WaitingScreen
							remoteLabel={remoteLabel}
							isThumbnail
							onPin={() => onPinView("REMOTE_CAM")}
						/>
					) : (
						<VideoCard
							stream={remoteVideoStream}
							isCamOn={isRemoteCamOn}
							label={remoteLabel}
							roleIndicator={!isMentor ? "Mentor" : undefined}
							isMicOn={isRemoteMicOn}
							isThumbnail
							onPin={() => onPinView("REMOTE_CAM")}
						/>
					)}
				</div>
			)}

			{/* Local Screen Thumbnail */}
			{pinnedViewId !== "LOCAL_SCREEN" && isScreenSharing && (
				<ScreenThumbnail
					stream={localScreenStream}
					label="Your Screen"
					onPin={() => onPinView("LOCAL_SCREEN")}
					muted
				/>
			)}

			{/* Remote Screen Thumbnail */}
			{pinnedViewId !== "REMOTE_SCREEN" && isRemoteScreenSharing && (
				<ScreenThumbnail
					stream={remoteScreenStream}
					label="Remote Screen"
					onPin={() => onPinView("REMOTE_SCREEN")}
				/>
			)}
		</div>
	);
};

interface ScreenThumbnailProps {
	stream: MediaStream | null;
	label: string;
	onPin: () => void;
	muted?: boolean;
}

const ScreenThumbnail: React.FC<ScreenThumbnailProps> = ({
	stream,
	label,
	onPin,
	muted,
}) => {
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (videoRef.current && stream) {
			videoRef.current.srcObject = stream;
		}
	}, [stream]);

	return (
		<div className="pointer-events-auto h-full aspect-video shadow-2xl relative rounded-xl overflow-hidden border border-slate-700">
			<video
				ref={videoRef}
				autoPlay
				playsInline
				muted={muted}
				className="w-full h-full object-cover"
			/>
			<div className="absolute top-2 right-2 z-20">
				<Button
					size="icon"
					variant="secondary"
					className="h-7 w-7 bg-black/50 hover:bg-black/80 backdrop-blur-md"
					onClick={(e) => {
						e.stopPropagation();
						onPin();
					}}
				>
					<Maximize2 className="h-4 w-4" />
				</Button>
			</div>
			<div className="absolute bottom-2 left-2 bg-black/50 px-2 py-0.5 rounded text-[10px] backdrop-blur-md">
				{label}
			</div>
		</div>
	);
};

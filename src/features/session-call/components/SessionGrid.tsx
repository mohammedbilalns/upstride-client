import type React from "react";
import { VideoCard } from "./VideoCard";
import { WaitingScreen } from "./WaitingScreen";

interface SessionGridProps {
	localStream: MediaStream | null;
	remoteVideoStream: MediaStream | null;
	isCamOn: boolean;
	isRemoteCamOn: boolean;
	localLabel: string;
	remoteLabel: string;
	isMentor: boolean;
	isMicOn: boolean;
	isRemoteMicOn: boolean;
	isWaiting: boolean;
}

export const SessionGrid: React.FC<SessionGridProps> = ({
	localStream,
	remoteVideoStream,
	isCamOn,
	isRemoteCamOn,
	localLabel,
	remoteLabel,
	isMentor,
	isMicOn,
	isRemoteMicOn,
	isWaiting,
}) => {
	return (
		<div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
			<VideoCard
				stream={localStream}
				isCamOn={isCamOn}
				label={localLabel}
				roleIndicator={isMentor ? "Mentor" : undefined}
				isMicOn={isMicOn}
				isLocal
				onPin={() => {}}
				isPinned
			/>
			<div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/50 flex items-center justify-center shadow-2xl">
				{isWaiting ? (
					<WaitingScreen remoteLabel={remoteLabel} />
				) : (
					<VideoCard
						stream={remoteVideoStream}
						isCamOn={isRemoteCamOn}
						label={remoteLabel}
						roleIndicator={!isMentor ? "Mentor" : undefined}
						isMicOn={isRemoteMicOn}
						onPin={() => {}}
						isPinned
					/>
				)}
			</div>
		</div>
	);
};

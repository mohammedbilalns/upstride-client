import {
	Mic,
	MicOff,
	MonitorUp,
	SquareCheck,
	Video,
	VideoOff,
	XSquare,
} from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";

interface CallControlsProps {
	isCamOn: boolean;
	isMicOn: boolean;
	isScreenSharing: boolean;
	isWhiteboardActive: boolean;
	onToggleCam: () => void;
	onToggleMic: () => void;
	onToggleScreenShare: () => void;
	onToggleWhiteboard: () => void;
	onEndCall: () => void;
}

export const CallControls: React.FC<CallControlsProps> = ({
	isCamOn,
	isMicOn,
	isScreenSharing,
	isWhiteboardActive,
	onToggleCam,
	onToggleMic,
	onToggleScreenShare,
	onToggleWhiteboard,
	onEndCall,
}) => {
	return (
		<div className="flex items-center justify-center gap-4 bg-background/90 p-4 backdrop-blur-md border border-border shadow-lg rounded-2xl mb-4 w-fit mx-auto">
			<Button
				variant={isMicOn ? "secondary" : "destructive"}
				size="icon"
				onClick={onToggleMic}
				className="rounded-full h-12 w-12"
				title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
			>
				{isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
			</Button>

			<Button
				variant={isCamOn ? "secondary" : "destructive"}
				size="icon"
				onClick={onToggleCam}
				className="rounded-full h-12 w-12"
				title={isCamOn ? "Turn off Camera" : "Turn on Camera"}
			>
				{isCamOn ? (
					<Video className="h-5 w-5" />
				) : (
					<VideoOff className="h-5 w-5" />
				)}
			</Button>

			<Button
				variant={isScreenSharing ? "default" : "secondary"}
				size="icon"
				onClick={onToggleScreenShare}
				className="rounded-full h-12 w-12"
				title={isScreenSharing ? "Stop sharing" : "Share screen"}
			>
				<MonitorUp className="h-5 w-5" />
			</Button>

			<Button
				variant={isWhiteboardActive ? "default" : "secondary"}
				size="icon"
				onClick={onToggleWhiteboard}
				className="rounded-full h-12 w-12"
				title="Toggle Whiteboard"
			>
				<SquareCheck className="h-5 w-5" />
			</Button>

			<Button
				variant="destructive"
				size="icon"
				onClick={onEndCall}
				className="rounded-full h-12 w-12 ml-4"
				title="End Call"
			>
				<XSquare className="h-6 w-6" />
			</Button>
		</div>
	);
};

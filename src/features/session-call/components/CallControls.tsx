import {
	Mic,
	MicOff,
	MonitorUp,
	SquareCheck,
	Video,
	VideoOff,
	XSquare,
	MessageSquare,
} from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/Button";

interface CallControlsProps {
	isCamOn: boolean;
	isMicOn: boolean;
	isScreenSharing: boolean;
	isWhiteboardActive: boolean;
	isMentor: boolean;
	onToggleCam: () => void;
	onToggleMic: () => void;
	onToggleScreenShare: () => void;
	onToggleWhiteboard: () => void;
	onLeave: () => void;
	onTerminate?: () => void;
	onToggleChat: () => void;
	isChatOpen: boolean;
	hasUnreadChat: boolean;
}

export const CallControls: React.FC<CallControlsProps> = ({
	isCamOn,
	isMicOn,
	isScreenSharing,
	isWhiteboardActive,
	isMentor,
	onToggleCam,
	onToggleMic,
	onToggleScreenShare,
	onToggleWhiteboard,
	onLeave,
	onTerminate,
	onToggleChat,
	isChatOpen,
	hasUnreadChat,
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
				variant={isChatOpen ? "default" : "secondary"}
				size="icon"
				onClick={onToggleChat}
				className="rounded-full h-12 w-12 relative"
				title={isChatOpen ? "Close Chat" : "Open Chat"}
			>
				<MessageSquare className="h-5 w-5" />
				{!isChatOpen && hasUnreadChat && (
					<span className="absolute top-2 right-2 h-3 w-3 bg-primary rounded-full border-2 border-background" />
				)}
			</Button>

			<div className="flex gap-2 ml-4 pl-4 border-l border-border">
				<Button
					variant="secondary"
					size="sm"
					onClick={onLeave}
					className="h-10 px-4 rounded-xl font-medium"
					title="Leave Session"
				>
					<XSquare className="h-4 w-4 mr-2" />
					Leave
				</Button>

				{isMentor && (
					<Button
						variant="destructive"
						size="sm"
						onClick={onTerminate}
						className="h-10 px-4 rounded-xl font-medium bg-rose-600 hover:bg-rose-700"
						title="Terminate Session"
					>
						<SquareCheck className="h-4 w-4 mr-2" />
						Terminate
					</Button>
				)}
			</div>
		</div>
	);
};

import {
	ChevronDown,
	MessageSquare,
	Mic,
	MicOff,
	MonitorUp,
	SquareCheck,
	Video,
	VideoOff,
	XSquare,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
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
	const [showMoreActions, setShowMoreActions] = useState(false);
	const inactiveControlClass =
		"border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900 shadow-sm";
	const activeControlClass =
		"bg-primary text-primary-foreground hover:bg-primary/90 border-primary shadow-sm";

	return (
		<div className="mx-auto mb-4 w-[calc(100%-1rem)] rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur-md sm:w-fit sm:max-w-fit sm:p-4 dark:border-border dark:bg-background/90">
			<div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
				<Button
					variant={isMicOn ? "secondary" : "destructive"}
					size="icon"
					onClick={onToggleMic}
					className={`h-10 w-10 rounded-full sm:h-12 sm:w-12 ${
						isMicOn ? inactiveControlClass : "shadow-sm"
					}`}
					title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
				>
					{isMicOn ? (
						<Mic className="h-4 w-4 sm:h-5 sm:w-5" />
					) : (
						<MicOff className="h-4 w-4 sm:h-5 sm:w-5" />
					)}
				</Button>

				<Button
					variant={isCamOn ? "secondary" : "destructive"}
					size="icon"
					onClick={onToggleCam}
					className={`h-10 w-10 rounded-full sm:h-12 sm:w-12 ${
						isCamOn ? inactiveControlClass : "shadow-sm"
					}`}
					title={isCamOn ? "Turn off Camera" : "Turn on Camera"}
				>
					{isCamOn ? (
						<Video className="h-4 w-4 sm:h-5 sm:w-5" />
					) : (
						<VideoOff className="h-4 w-4 sm:h-5 sm:w-5" />
					)}
				</Button>

				<Button
					variant={isScreenSharing ? "default" : "secondary"}
					size="icon"
					onClick={onToggleScreenShare}
					className={`h-10 w-10 rounded-full sm:h-12 sm:w-12 ${
						isScreenSharing ? activeControlClass : inactiveControlClass
					}`}
					title={isScreenSharing ? "Stop sharing" : "Share screen"}
				>
					<MonitorUp className="h-4 w-4 sm:h-5 sm:w-5" />
				</Button>

				<Button
					variant={isWhiteboardActive ? "default" : "secondary"}
					size="icon"
					onClick={onToggleWhiteboard}
					className={`h-10 w-10 rounded-full sm:h-12 sm:w-12 ${
						isWhiteboardActive ? activeControlClass : inactiveControlClass
					}`}
					title="Toggle Whiteboard"
				>
					<SquareCheck className="h-4 w-4 sm:h-5 sm:w-5" />
				</Button>

				<Button
					variant={isChatOpen ? "default" : "secondary"}
					size="icon"
					onClick={onToggleChat}
					className={`relative h-10 w-10 rounded-full sm:h-12 sm:w-12 ${
						isChatOpen ? activeControlClass : inactiveControlClass
					}`}
					title={isChatOpen ? "Close Chat" : "Open Chat"}
				>
					<MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
					{!isChatOpen && hasUnreadChat && (
						<span className="absolute top-2 right-2 h-3 w-3 rounded-full border-2 border-background bg-primary" />
					)}
				</Button>

				<Button
					type="button"
					variant="secondary"
					size="sm"
					onClick={() => setShowMoreActions((value) => !value)}
					className={`h-10 rounded-full px-4 font-medium sm:hidden ${inactiveControlClass}`}
					title="More actions"
				>
					<span>More</span>
					<ChevronDown
						className={`h-4 w-4 transition-transform ${
							showMoreActions ? "rotate-180" : ""
						}`}
					/>
				</Button>
			</div>

			<div
				className={`${
					showMoreActions ? "mt-3 flex" : "hidden"
				} flex-col gap-2 border-t border-slate-200 pt-3 sm:hidden dark:border-border`}
			>
				<Button
					variant="secondary"
					size="sm"
					onClick={onLeave}
					className={`h-10 rounded-xl px-4 font-medium ${inactiveControlClass}`}
					title="Leave Session"
				>
					<XSquare className="mr-2 h-4 w-4" />
					Leave
				</Button>

				{isMentor && (
					<Button
						variant="destructive"
						size="sm"
						onClick={onTerminate}
						className="h-10 rounded-xl bg-rose-600 px-4 font-medium text-white shadow-sm hover:bg-rose-700 hover:text-white"
						title="Terminate Session"
					>
						<SquareCheck className="mr-2 h-4 w-4 text-white" />
						Terminate
					</Button>
				)}
			</div>

			<div className="ml-4 hidden gap-2 border-l border-slate-200 pl-4 dark:border-border sm:flex sm:items-center">
				<Button
					variant="secondary"
					size="sm"
					onClick={onLeave}
					className={`h-10 rounded-xl px-4 font-medium ${inactiveControlClass}`}
					title="Leave Session"
				>
					<XSquare className="mr-2 h-4 w-4" />
					Leave
				</Button>

				{isMentor && (
					<Button
						variant="destructive"
						size="sm"
						onClick={onTerminate}
						className="h-10 rounded-xl bg-rose-600 px-4 font-medium text-white shadow-sm hover:bg-rose-700 hover:text-white"
						title="Terminate Session"
					>
						<SquareCheck className="mr-2 h-4 w-4 text-white" />
						Terminate
					</Button>
				)}
			</div>
		</div>
	);
};

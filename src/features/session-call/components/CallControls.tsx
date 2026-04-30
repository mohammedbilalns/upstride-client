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
		"border-transparent bg-slate-100/80 text-slate-700 hover:bg-slate-200 hover:text-slate-900 shadow-none dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white";
	const activeScreenClass =
		"bg-blue-500 text-white hover:bg-blue-600 border-transparent shadow-md";
	const activeWhiteboardClass =
		"bg-emerald-500 text-white hover:bg-emerald-600 border-transparent shadow-md";
	const activeChatClass =
		"bg-primary text-primary-foreground hover:bg-primary/90 border-transparent shadow-md";
	const leaveClass =
		"bg-red-500/15 text-red-700 hover:bg-red-500/25 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30 border-transparent shadow-none";

	return (
		<div className="mx-auto mb-4 w-[calc(100%-1rem)] rounded-3xl border border-slate-200/70 bg-white/90 p-2 shadow-lg shadow-black/5 backdrop-blur-xl sm:flex sm:w-fit sm:max-w-fit sm:items-center sm:p-2 dark:border-border/70 dark:bg-background/80">
			<div className="flex flex-wrap items-center justify-center gap-2">
				<Button
					variant={isMicOn ? "secondary" : "destructive"}
					size="icon"
					onClick={onToggleMic}
					className={`h-10 w-10 rounded-full sm:h-11 sm:w-11 ${
						isMicOn ? inactiveControlClass : "shadow-md"
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
					className={`h-10 w-10 rounded-full sm:h-11 sm:w-11 ${
						isCamOn ? inactiveControlClass : "shadow-md"
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
					className={`h-10 w-10 rounded-full sm:h-11 sm:w-11 ${
						isScreenSharing ? activeScreenClass : inactiveControlClass
					}`}
					title={isScreenSharing ? "Stop sharing" : "Share screen"}
				>
					<MonitorUp className="h-4 w-4 sm:h-5 sm:w-5" />
				</Button>

				<Button
					variant={isWhiteboardActive ? "default" : "secondary"}
					size="icon"
					onClick={onToggleWhiteboard}
					className={`h-10 w-10 rounded-full sm:h-11 sm:w-11 ${
						isWhiteboardActive ? activeWhiteboardClass : inactiveControlClass
					}`}
					title="Toggle Whiteboard"
				>
					<SquareCheck className="h-4 w-4 sm:h-5 sm:w-5" />
				</Button>

				<Button
					variant={isChatOpen ? "default" : "secondary"}
					size="icon"
					onClick={onToggleChat}
					className={`relative h-10 w-10 rounded-full sm:h-11 sm:w-11 ${
						isChatOpen ? activeChatClass : inactiveControlClass
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
					showMoreActions ? "mt-2 flex" : "hidden"
				} flex-col gap-2 border-t border-slate-200/60 pt-2 sm:hidden dark:border-border/60`}
			>
				<Button
					variant="secondary"
					size="sm"
					onClick={onLeave}
					className={`h-10 rounded-2xl px-4 font-medium ${leaveClass}`}
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
						className="h-10 rounded-2xl bg-red-600 px-4 font-medium text-white shadow-sm hover:bg-red-700 hover:text-white border-transparent"
						title="Terminate Session"
					>
						<SquareCheck className="mr-2 h-4 w-4 text-white" />
						Terminate
					</Button>
				)}
			</div>

			<div className="hidden gap-2 sm:ml-2 sm:flex sm:items-center sm:border-l sm:border-slate-200/60 sm:pl-3 sm:dark:border-border/60">
				<Button
					variant="secondary"
					size="sm"
					onClick={onLeave}
					className={`h-11 rounded-2xl px-4 font-medium ${leaveClass}`}
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
						className="h-11 rounded-2xl bg-red-600 px-4 font-medium text-white shadow-sm hover:bg-red-700 hover:text-white border-transparent"
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

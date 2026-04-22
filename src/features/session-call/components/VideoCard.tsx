import { Pin } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";

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

export const VideoCard: React.FC<VideoCardProps> = ({
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

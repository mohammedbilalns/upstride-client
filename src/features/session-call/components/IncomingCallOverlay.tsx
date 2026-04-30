import { Phone, PhoneOff, Video } from "lucide-react";
import type React from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { startRinging } from "@/shared/utils/audio";

interface IncomingCallOverlayProps {
	bookingId: string;
	joinerName: string;
	joinerRole: string;
	onAccept: () => void;
	onDecline: () => void;
}

export const IncomingCallOverlay: React.FC<IncomingCallOverlayProps> = ({
	joinerName,
	joinerRole,
	onAccept,
	onDecline,
}) => {
	useEffect(() => {
		const stopRinging = startRinging();
		return () => {
			stopRinging();
		};
	}, []);

	return (
		<div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
			<div className="w-full max-w-sm rounded-[2rem] border border-white/10 bg-slate-900 p-8 text-center text-slate-50 shadow-2xl animate-in zoom-in-95 duration-500">
				<div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/20">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary animate-pulse shadow-[0_0_40px_rgba(14,165,233,0.5)]">
						<Video className="h-8 w-8 text-white" />
					</div>
				</div>
				<h2 className="mb-2 text-2xl font-semibold tracking-tight">
					{joinerName}
				</h2>
				<p className="mb-8 text-slate-400">
					{joinerRole} is calling to join the session
				</p>
				<div className="flex justify-center gap-6">
					<div className="flex flex-col items-center gap-2">
						<Button
							variant="destructive"
							size="icon"
							onClick={onDecline}
							className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20"
						>
							<PhoneOff className="h-7 w-7" />
						</Button>
						<span className="text-xs font-medium text-slate-400">Decline</span>
					</div>
					<div className="flex flex-col items-center gap-2">
						<Button
							size="icon"
							onClick={onAccept}
							className="h-16 w-16 rounded-full bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 text-white"
						>
							<Phone className="h-7 w-7" />
						</Button>
						<span className="text-xs font-medium text-slate-400">Accept</span>
					</div>
				</div>
			</div>
		</div>
	);
};

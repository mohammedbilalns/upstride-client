import { Loader2, Maximize2 } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";

interface WaitingScreenProps {
	remoteLabel: string;
	isThumbnail?: boolean;
	onPin?: () => void;
}

export const WaitingScreen: React.FC<WaitingScreenProps> = ({
	remoteLabel,
	isThumbnail,
	onPin,
}) => {
	if (isThumbnail) {
		return (
			<div className="h-full w-full rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-2 text-[10px] text-slate-500">
				<Loader2 className="h-4 w-4 animate-spin mb-1" />
				<span className="text-center">Waiting...</span>
				{onPin && (
					<Button
						size="icon"
						variant="ghost"
						className="h-6 w-6 mt-1 text-slate-400 hover:text-slate-100 hover:bg-white/5"
						onClick={(e) => {
							e.stopPropagation();
							onPin();
						}}
					>
						<Maximize2 className="h-3.5 w-3.5" />
					</Button>
				)}
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center justify-center text-slate-400 p-8 text-center">
			<Loader2 className="h-12 w-12 animate-spin mb-4 text-primary" />
			<h3 className="text-xl font-semibold mb-2 text-slate-100">
				Waiting for {remoteLabel} to join...
			</h3>
			<p className="max-w-xs text-sm">
				{remoteLabel} has been notified and should be here shortly.
			</p>
		</div>
	);
};

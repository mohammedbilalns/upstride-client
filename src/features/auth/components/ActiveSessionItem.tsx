import { formatDistanceToNow } from "date-fns";
import {
	Clock,
	Laptop,
	Loader2,
	Monitor,
	Router,
	ShieldCheck,
	Smartphone,
	XCircle,
} from "lucide-react";
import { useState } from "react";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useRevokeSession } from "../hooks/mutations/useRevokeSession";
import type { ActiveSession } from "../types";

interface ActiveSessionItemProps {
	session: ActiveSession;
}

export function ActiveSessionItem({ session }: ActiveSessionItemProps) {
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const revokeSession = useRevokeSession();

	const getDeviceIcon = (deviceType: string) => {
		switch (deviceType.toLowerCase()) {
			case "mobile":
				return <Smartphone className="h-5 w-5" />;
			case "tablet":
				return <Smartphone className="h-5 w-5" />;
			case "desktop":
				return <Monitor className="h-5 w-5" />;
			case "laptop":
				return <Laptop className="h-5 w-5" />;
			default:
				return <Monitor className="h-5 w-5" />;
		}
	};

	const handleRevoke = async () => {
		await revokeSession.mutateAsync(session.id);
		setIsConfirmOpen(false);
	};

	return (
		<>
			<div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/30 group">
				<div className="flex items-start gap-4">
					<div className="mt-1 p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
						{getDeviceIcon(session.deviceType)}
					</div>
					<div className="space-y-1">
						<div className="flex items-center gap-2">
							<span className="font-semibold text-foreground">
								{session.deviceName}
							</span>
							{session.isCurrent && (
								<Badge
									variant="secondary"
									className="h-5 text-[10px] bg-green-500/10 text-green-600 border-green-500/20"
								>
									Current Session
								</Badge>
							)}
						</div>
						<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
							<div className="flex items-center gap-1.5">
								<Router className="h-3.5 w-3.5" />
								IP Address {session.ip}
							</div>
							<div className="flex items-center gap-1.5">
								<Clock className="h-3.5 w-3.5" />
								Last active {formatDistanceToNow(new Date(session.lastUsedAt))}{" "}
								ago
							</div>
						</div>
					</div>
				</div>

				{!session.isCurrent && (
					<Button
						variant="ghost"
						size="sm"
						className="text-destructive hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
						onClick={() => setIsConfirmOpen(true)}
						disabled={revokeSession.isPending}
					>
						<XCircle className="h-4 w-4 mr-2" />
						Terminate
					</Button>
				)}
				{session.isCurrent && (
					<div className="flex items-center text-xs text-green-600 font-medium px-2 py-1 rounded-md bg-green-500/5 border border-green-500/10">
						<ShieldCheck className="h-3.5 w-3.5 mr-1.5" />
						Secure
					</div>
				)}
			</div>

			<ConfirmModal
				isOpen={isConfirmOpen}
				onClose={() => setIsConfirmOpen(false)}
				onConfirm={handleRevoke}
				title="Terminate Session"
				message="Are you sure you want to terminate this session?"
				variant="destructive"
				confirmText={
					revokeSession.isPending ? (
						<div className="flex items-center gap-2">
							<Loader2 className="w-4 h-4 animate-spin" />
							<span>Terminating...</span>
						</div>
					) : (
						"Terminate"
					)
				}
				isLoading={revokeSession.isPending}
			/>
		</>
	);
}

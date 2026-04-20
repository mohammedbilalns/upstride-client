import { Loader2, RefreshCcw, ShieldAlert, Trash2 } from "lucide-react";
import { useState } from "react";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";
import { useActiveSessions } from "../hooks/queries/useActiveSessions";
import { useRevokeAllOtherSessions } from "../hooks/mutations/useRevokeAllOtherSessions";
import { ActiveSessionItem } from "./ActiveSessionItem";

export function ActiveSessionList() {
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const { data: sessions, isLoading, isError, refetch } = useActiveSessions();
	const revokeAllOther = useRevokeAllOtherSessions();

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center p-12 space-y-4">
				<Loader2 className="h-8 w-8 text-primary animate-spin" />
				<p className="text-sm text-muted-foreground animate-pulse">
					Loading active sessions...
				</p>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="flex flex-col items-center justify-center p-12 space-y-4 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive">
				<ShieldAlert className="h-8 w-8" />
				<p className="text-sm font-medium">Failed to load active sessions</p>
				<Button variant="outline" size="sm" onClick={() => refetch()}>
					<RefreshCcw className="h-4 w-4 mr-2" />
					Try Again
				</Button>
			</div>
		);
	}

	const otherSessionsCount = sessions?.filter((s) => !s.isCurrent).length || 0;

	const handleRevokeAll = async () => {
		await revokeAllOther.mutateAsync();
		setIsConfirmOpen(false);
	};

	return (
		<>
			<Card className="border-border/60 bg-background/50 backdrop-blur-md shadow-lg shadow-black/5">
				<CardHeader className="flex flex-col md:flex-row md:items-center justify-between space-y-0 pb-6 gap-4">
					<div className="space-y-1.5">
						<CardTitle className="text-xl font-bold flex items-center gap-2">
							Active Sessions
							<Badge variant="outline" className="font-normal text-xs ml-2">
								{sessions?.length || 0}
							</Badge>
						</CardTitle>
						<CardDescription className="text-sm">
							Manage your active sessions across different devices and browsers.
						</CardDescription>
					</div>
					{otherSessionsCount > 0 && (
						<Button
							variant="destructive"
							size="sm"
							className="shadow-sm shadow-destructive/20"
							onClick={() => setIsConfirmOpen(true)}
							disabled={revokeAllOther.isPending}
						>
							<Trash2 className="h-4 w-4 mr-2" />
							Terminate All Others
						</Button>
					)}
				</CardHeader>
				<CardContent className="space-y-4">
					{sessions?.map((session) => (
						<ActiveSessionItem key={session.id} session={session} />
					))}

					{sessions?.length === 0 && (
						<div className="text-center py-8 text-muted-foreground italic">
							No active sessions found.
						</div>
					)}
				</CardContent>
			</Card>

			<ConfirmModal
				isOpen={isConfirmOpen}
				onClose={() => setIsConfirmOpen(false)}
				onConfirm={handleRevokeAll}
				title="Terminate All Other Sessions"
				message="Are you sure you want to terminate all other sessions?"
				variant="destructive"
				confirmText={
					revokeAllOther.isPending ? (
						<div className="flex items-center gap-2">
							<Loader2 className="w-4 h-4 animate-spin" />
							<span>Terminating...</span>
						</div>
					) : (
						"Terminate All"
					)
				}
				isLoading={revokeAllOther.isPending}
			/>
		</>
	);
}

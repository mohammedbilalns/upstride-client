import { Activity, Database, RefreshCcw, Server } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { AdminDashboardResponse } from "../types";
import { formatDisplayDate, formatDuration } from "../utils";
import { HealthStatusRow } from "./HealthStatusRow";

interface SystemHealthCardProps {
	systemHealth: AdminDashboardResponse["systemHealth"];
}

export function SystemHealthCard({ systemHealth }: SystemHealthCardProps) {
	return (
		<Card className="gap-0 border-border/70 bg-card/95 shadow-sm">
			<CardHeader className="px-4 pt-4">
				<div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
					<div>
						<CardTitle className="text-lg">System Health</CardTitle>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-2.5 px-4 pb-4">
				<div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-background/60 px-4 py-3 text-sm text-muted-foreground">
					<RefreshCcw className="h-4 w-4 text-primary" />
					<span>
						Last health snapshot:{" "}
						{formatDisplayDate(
							new Date(systemHealth.timestamp).toISOString().slice(0, 10),
						)}
					</span>
				</div>
				<HealthStatusRow
					label="MongoDB"
					result={systemHealth.dependencies.mongo}
					icon={Database}
				/>
				<HealthStatusRow
					label="Redis"
					result={systemHealth.dependencies.redis}
					icon={Server}
				/>
				<HealthStatusRow
					label="Notification Queue"
					result={systemHealth.services.notificationQueue}
					icon={Activity}
				/>
				<div className="rounded-3xl border border-border/70 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.16),transparent_45%),hsl(var(--background))] p-4 text-center">
					<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
						<Activity className="h-7 w-7 text-emerald-500" />
					</div>
					<p className="mt-3 text-base font-semibold">
						{systemHealth.status === "ok"
							? "All Systems Operational"
							: "System Needs Attention"}
					</p>
					<p className="mt-1.5 text-sm text-muted-foreground">
						Uptime {formatDuration(systemHealth.uptimeSeconds)}
					</p>
				</div>
			</CardContent>
		</Card>
	);
}

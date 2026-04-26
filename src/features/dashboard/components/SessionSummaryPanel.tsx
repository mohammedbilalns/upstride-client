import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { DashboardViewModel } from "../types";
import { buildDonutGradient } from "../utils/dashboard.charts";

interface SessionSummaryPanelProps {
	dashboard: DashboardViewModel | null;
}

export function SessionSummaryPanel({ dashboard }: SessionSummaryPanelProps) {
	const completed = dashboard?.completedSessionCount ?? 0;
	const upcoming = dashboard?.upcomingSessionsCount ?? 0;
	const cancelled = 0;
	const values = [completed, upcoming, cancelled];
	const total = values.reduce((sum, value) => sum + value, 0) || 1;

	const slices = [
		{ label: "Completed", value: completed, color: "#22c55e" },
		{ label: "Upcoming", value: upcoming, color: "#3b82f6" },
		{ label: "Cancelled", value: cancelled, color: "#f87171" },
	];

	return (
		<Card className="gap-0 border-border/60 shadow-sm">
			<CardHeader>
				<CardTitle className="text-lg">Session Summary</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full border border-border/60 bg-muted/20">
					<div
						className="relative flex h-32 w-32 items-center justify-center rounded-full"
						style={{
							background: `conic-gradient(${buildDonutGradient(slices, total)})`,
						}}
					>
						<div className="flex h-20 w-20 flex-col items-center justify-center rounded-full border border-border/60 bg-card text-center">
							<p className="text-xl font-semibold">
								{completed + upcoming + cancelled}
							</p>
							<p className="text-xs text-muted-foreground">Total Sessions</p>
						</div>
					</div>
				</div>
				<div className="space-y-1.5">
					{slices.map((slice) => (
						<div
							key={slice.label}
							className="flex items-center justify-between text-xs"
						>
							<div className="flex items-center gap-2">
								<span
									className="h-2.5 w-2.5 rounded-full"
									style={{ backgroundColor: slice.color }}
								/>
								<span>{slice.label}</span>
							</div>
							<span className="text-muted-foreground">
								{slice.value} ({Math.round((slice.value / total) * 100)}%)
							</span>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

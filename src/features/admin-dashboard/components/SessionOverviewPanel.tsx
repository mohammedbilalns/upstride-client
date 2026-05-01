import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { AdminDashboardSessionOverviewResponse } from "../types";
import { buildDonutGradient, numberFormatter } from "../utils";

interface SessionOverviewPanelProps {
	overview: AdminDashboardSessionOverviewResponse;
}

export function SessionOverviewPanel({ overview }: SessionOverviewPanelProps) {
	const slices = [
		{ label: "Completed", value: overview.completed, color: "#22c55e" },
		{ label: "Upcoming", value: overview.upcoming, color: "#3b82f6" },
		{ label: "Cancelled", value: overview.cancelled, color: "#ef4444" },
	];

	return (
		<Card className="gap-0 border-border/70 bg-card/95 shadow-sm">
			<CardHeader className="flex flex-row items-center justify-between px-4 pt-4">
				<div>
					<CardTitle className="text-lg">Session Overview</CardTitle>
				</div>
			</CardHeader>
			<CardContent className="px-4 pb-4">
				<div className="grid gap-4 lg:grid-cols-[200px_1fr]">
					<div className="flex items-center justify-center">
						<div
							className="relative flex h-40 w-40 items-center justify-center rounded-full"
							style={{
								background: `conic-gradient(${buildDonutGradient(
									slices,
									overview.totalSessions,
								)})`,
							}}
						>
							<div className="flex h-28 w-28 flex-col items-center justify-center rounded-full border border-border bg-card text-center">
								<p className="text-3xl font-semibold">
									{numberFormatter.format(overview.totalSessions)}
								</p>
								<p className="text-xs text-muted-foreground">Total Sessions</p>
							</div>
						</div>
					</div>
					<div className="space-y-3">
						<div className="grid gap-3 md:grid-cols-3">
							{slices.map((slice) => (
								<div
									key={slice.label}
									className="rounded-2xl border border-border/70 bg-background/60 px-3 py-2.5 text-sm"
								>
									<div className="flex items-center gap-3">
										<span
											className="h-3 w-3 rounded-full"
											style={{ backgroundColor: slice.color }}
										/>
										<span>{slice.label}</span>
									</div>
									<span className="mt-2 block text-muted-foreground">
										{numberFormatter.format(slice.value)} (
										{overview.totalSessions > 0
											? Math.round((slice.value / overview.totalSessions) * 100)
											: 0}
										%)
									</span>
								</div>
							))}
						</div>
						<div className="grid gap-2.5 sm:grid-cols-2">
							<div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3">
								<p className="text-xs uppercase tracking-[0.16em] text-emerald-500">
									Completion Rate
								</p>
								<p className="mt-1 text-2xl font-semibold">
									{overview.completionRate.toFixed(1)}%
								</p>
							</div>
							<div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3">
								<p className="text-xs uppercase tracking-[0.16em] text-rose-500">
									Cancellation Rate
								</p>
								<p className="mt-1 text-2xl font-semibold">
									{overview.cancellationRate.toFixed(1)}%
								</p>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

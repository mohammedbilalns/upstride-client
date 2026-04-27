import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatDateShort } from "@/shared/utils/date";
import type { DashboardActivityItemDto, DashboardRole } from "../types";
import { DASHBOARD_ACTIVITY_ICON } from "../utils/dashboard.constants";

interface RecentActivityPanelProps {
	items: DashboardActivityItemDto[];
	dashboardRole: DashboardRole;
}

export function RecentActivityPanel({
	items,
	dashboardRole,
}: RecentActivityPanelProps) {
	return (
		<Card className="gap-0 border-border/60 shadow-sm">
			<CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
				<div className="space-y-1">
					<CardTitle className="text-lg">Recent Activity</CardTitle>
					<p className="text-xs text-muted-foreground">
						The latest session and mentor actions.
					</p>
				</div>
				<Link
					className="inline-flex items-center gap-2 text-sm font-medium text-foreground"
					to={dashboardRole === "MENTOR" ? "/mentor-sessions" : "/sessions"}
					search={
						dashboardRole === "MENTOR"
							? { filter: "upcoming", page: 1, limit: 10 }
							: {
									tab: "upcoming",
									page: 1,
									limit: 12,
									upcomingFilter: "upcoming",
									pastFilter: "completed",
								}
					}
				>
					View all activity <ArrowRight className="h-4 w-4" />
				</Link>
			</CardHeader>
			<CardContent className="space-y-2.5">
				{items.length === 0 ? (
					<div className="rounded-2xl border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
						No recent activity yet.
					</div>
				) : (
					items.map((item) => {
						const Icon = DASHBOARD_ACTIVITY_ICON[item.type];
						return (
							<div
								key={item.id}
								className="flex items-start gap-3 rounded-2xl border border-border/60 p-3.5"
							>
								<div className="rounded-xl bg-primary/10 p-2 text-primary">
									<Icon className="h-4 w-4" />
								</div>
								<div className="min-w-0 flex-1">
									<p className="text-sm font-medium leading-tight">
										{item.title}
									</p>
									<p className="text-xs text-muted-foreground">
										{item.description}
									</p>
								</div>
								<span className="whitespace-nowrap text-[11px] text-muted-foreground">
									{formatDateShort(item.occurredAt)}
								</span>
							</div>
						);
					})
				)}
			</CardContent>
		</Card>
	);
}

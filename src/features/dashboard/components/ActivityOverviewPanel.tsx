import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select";
import type { DashboardActivityOverviewDto, DashboardPeriod } from "../types";
import { LineChart } from "./LineChart";

interface ActivityOverviewPanelProps {
	activityOverview: DashboardActivityOverviewDto;
	period: DashboardPeriod;
	setPeriod: (value: DashboardPeriod) => void;
	isFetching: boolean;
}

export function ActivityOverviewPanel({
	activityOverview,
	period,
	setPeriod,
	isFetching,
}: ActivityOverviewPanelProps) {
	return (
		<Card className="gap-0 border-border/60 shadow-sm">
			<CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
				<div className="space-y-1">
					<CardTitle className="text-lg">Activity Overview</CardTitle>
					<p className="text-xs text-muted-foreground">
						Session and hours activity for the selected period.
					</p>
				</div>
				<Select
					value={period}
					onValueChange={(value) => setPeriod(value as DashboardPeriod)}
				>
					<SelectTrigger className="h-8 w-[132px]">
						<SelectValue placeholder="This Month" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="week">This Week</SelectItem>
						<SelectItem value="month">This Month</SelectItem>
						<SelectItem value="year">This Year</SelectItem>
					</SelectContent>
				</Select>
			</CardHeader>
			<CardContent className="space-y-2.5">
				<div className="flex flex-wrap items-center gap-2.5 text-[11px] text-muted-foreground">
					<div className="flex items-center gap-2">
						<span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
						<span>Sessions</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
						<span>Hours learned</span>
					</div>
					{isFetching && (
						<div className="flex items-center gap-2 text-muted-foreground">
							<Loader2 className="h-3.5 w-3.5 animate-spin" />
							<span>Updating</span>
						</div>
					)}
				</div>
				<LineChart overview={activityOverview} />
			</CardContent>
		</Card>
	);
}

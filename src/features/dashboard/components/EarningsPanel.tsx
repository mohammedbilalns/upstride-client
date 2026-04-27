import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { DashboardViewModel } from "../types";
import { formatUnitAmount } from "../utils/dashboard.formatters";
import { BarChart } from "./BarChart";

interface EarningsPanelProps {
	dashboard: DashboardViewModel;
}

export function EarningsPanel({ dashboard }: EarningsPanelProps) {
	const chart = dashboard.earningsChart ?? {
		period: "month" as const,
		labels: [],
		values: [],
	};
	const total = dashboard.netEarnings ?? dashboard.totalRevenue ?? 0;
	const fees = dashboard.platformFees ?? 0;
	const unit = dashboard.earningsCurrency ?? "COINS";

	return (
		<Card className="gap-0 border-border/60 shadow-sm">
			<CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
				<div className="space-y-1">
					<CardTitle className="text-lg">Earnings Overview</CardTitle>
					<p className="text-xs text-muted-foreground">
						Actual credited earnings from completed sessions this month.
					</p>
				</div>
				<Badge variant="secondary" className="h-7 px-2.5 text-[11px]">
					This Month
				</Badge>
			</CardHeader>
			<CardContent className="space-y-3">
				<BarChart labels={chart.labels} values={chart.values} unit={unit} />
				<div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
					<div className="rounded-2xl border border-border/60 p-3.5">
						<p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
							Credited Earnings
						</p>
						<p className="mt-1 text-base font-semibold">
							{formatUnitAmount(total, unit)}
						</p>
					</div>
					<div className="rounded-2xl border border-border/60 p-3.5">
						<p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
							Platform Fees
						</p>
						<p className="mt-1 text-base font-semibold">
							{formatUnitAmount(fees, unit)}
						</p>
					</div>
					<div className="rounded-2xl border border-border/60 p-3.5">
						<p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
							Completed Sessions
						</p>
						<p className="mt-1 text-base font-semibold">
							{dashboard.totalSessionsAttended ?? 0}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

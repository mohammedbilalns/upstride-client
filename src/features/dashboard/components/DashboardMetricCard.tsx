import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { DASHBOARD_TONE_CLASSES } from "../utils/dashboard.constants";

interface DashboardMetricCardProps {
	title: string;
	value: string;
	subtitle: string;
	icon: LucideIcon;
	tone: keyof typeof DASHBOARD_TONE_CLASSES;
}

export function DashboardMetricCard({
	title,
	value,
	subtitle,
	icon: Icon,
	tone,
}: DashboardMetricCardProps) {
	return (
		<Card className="gap-0 border-border/60 shadow-sm transition-shadow hover:shadow-md">
			<CardContent className="p-4">
				<div className="flex items-start justify-between gap-3">
					<div className="space-y-1.5">
						<p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
							{title}
						</p>
						<p className="text-2xl font-semibold tracking-tight">{value}</p>
						<p className="text-xs text-muted-foreground">{subtitle}</p>
					</div>
					<div className={`rounded-2xl p-2.5 ${DASHBOARD_TONE_CLASSES[tone]}`}>
						<Icon className="h-4.5 w-4.5" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

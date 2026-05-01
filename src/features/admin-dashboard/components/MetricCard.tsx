import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { ComponentType } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";
import { cn } from "@/shared/utils/cn";
import { buildLinePath, percent } from "../utils";

interface MetricCardProps {
	title: string;
	value: string;
	changePercent: number;
	subtitle: string;
	icon: ComponentType<{ className?: string }>;
	sparkline: number[];
	chartColor: string;
}

export function MetricCard({
	title,
	value,
	changePercent,
	subtitle,
	icon: Icon,
	sparkline,
	chartColor,
}: MetricCardProps) {
	const isPositive = changePercent >= 0;
	const path = buildLinePath(sparkline, 320, 90);

	return (
		<Card className="gap-3 border-border/70 bg-card/95 shadow-sm">
			<CardHeader className="px-4 pt-3 pb-0">
				<div className="flex items-start justify-between gap-4">
					<div>
						<CardDescription>{title}</CardDescription>
						<CardTitle className="mt-1 text-xl font-semibold">
							{value}
						</CardTitle>
					</div>
					<div className="rounded-2xl border border-border bg-muted/40 p-2.5">
						<Icon className="h-4 w-4 text-primary" />
					</div>
				</div>
			</CardHeader>
			<CardContent className="px-4 pb-3">
				<div
					className={cn(
						"mb-2 inline-flex items-center gap-1 text-xs font-medium",
						isPositive ? "text-emerald-500" : "text-rose-500",
					)}
				>
					{isPositive ? (
						<ArrowUpRight className="h-4 w-4" />
					) : (
						<ArrowDownRight className="h-4 w-4" />
					)}
					<span>{percent(changePercent)}</span>
					<span className="text-muted-foreground">vs last month</span>
				</div>
				<div className="overflow-hidden rounded-2xl border border-border/70 bg-background/60">
					<svg
						viewBox="0 0 320 90"
						className="h-14 w-full"
						role="img"
						aria-label={`${title} trend`}
					>
						<title>{`${title} trend`}</title>
						<path
							d={path}
							fill="none"
							stroke={chartColor}
							strokeWidth="3.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</div>
				<p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
			</CardContent>
		</Card>
	);
}

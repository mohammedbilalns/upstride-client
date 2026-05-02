import type { ComponentType } from "react";
import { cn } from "@/shared/utils/cn";
import type { HealthCheckResult } from "../types";

interface HealthStatusRowProps {
	label: string;
	result: HealthCheckResult;
	icon: ComponentType<{ className?: string }>;
}

export function HealthStatusRow({
	label,
	result,
	icon: Icon,
}: HealthStatusRowProps) {
	return (
		<div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 px-3 py-2.5">
			<div className="flex items-center gap-3">
				<div className="rounded-xl border border-border bg-muted/40 p-2">
					<Icon className="h-4 w-4 text-primary" />
				</div>
				<div>
					<p className="text-sm font-medium">{label}</p>
					<p className="text-[11px] text-muted-foreground">
						{result.latencyMs} ms
					</p>
				</div>
			</div>
			<span
				className={cn(
					"rounded-full px-3 py-1 text-xs font-medium",
					result.status === "up"
						? "bg-emerald-500/10 text-emerald-500"
						: "bg-rose-500/10 text-rose-500",
				)}
			>
				{result.status === "up" ? "Operational" : "Degraded"}
			</span>
		</div>
	);
}

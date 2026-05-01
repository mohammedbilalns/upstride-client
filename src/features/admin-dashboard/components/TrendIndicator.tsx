import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { percent } from "../utils";

interface TrendIndicatorProps {
	value: number;
	label: string;
}

export function TrendIndicator({ value, label }: TrendIndicatorProps) {
	const isPositive = value >= 0;

	return (
		<div
			className={cn(
				"mt-1 inline-flex items-center gap-1 text-xs font-medium",
				isPositive ? "text-emerald-500" : "text-rose-500",
			)}
		>
			{isPositive ? (
				<ArrowUpRight className="h-3.5 w-3.5" />
			) : (
				<ArrowDownRight className="h-3.5 w-3.5" />
			)}
			<span>{percent(value)}</span>
			<span className="text-muted-foreground">{label}</span>
		</div>
	);
}

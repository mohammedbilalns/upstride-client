import { formatNumber } from "../utils/dashboard.formatters";

interface BarChartProps {
	labels: string[];
	values: number[];
}

export function BarChart({ labels, values }: BarChartProps) {
	const maxValue = Math.max(...values, 1);

	return (
		<div className="space-y-4">
			<div className="grid min-h-56 grid-cols-[repeat(auto-fit,minmax(16px,1fr))] items-end gap-2 rounded-2xl border border-border/60 bg-muted/10 p-4">
				{values.map((value, index) => {
					const label = labels[index] ?? `bar-${value}`;
					const height = `${Math.max((value / maxValue) * 100, 6)}%`;
					return (
						<div
							key={`${label}-${value}`}
							className="flex h-full flex-col items-center justify-end gap-2"
						>
							<div className="text-xs text-muted-foreground">
								{formatNumber(value, 0)}
							</div>
							<div
								className="w-full rounded-t-lg bg-violet-500/80 transition-all"
								style={{ height }}
							/>
							<div className="text-[11px] text-center text-muted-foreground">
								{labels[index] ?? ""}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}

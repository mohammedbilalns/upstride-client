import { formatNumber } from "../utils/dashboard.formatters";

interface BarChartProps {
	labels: string[];
	values: number[];
	unit?: string;
}

export function BarChart({ labels, values, unit = "COINS" }: BarChartProps) {
	const maxValue = Math.max(...values, 1);
	const peakIndex = values.indexOf(maxValue);
	const activeDays = values.filter((value) => value > 0).length;
	const maxVisibleLabels = 7;
	const labelInterval = Math.max(
		1,
		Math.ceil(labels.length / maxVisibleLabels),
	);
	const visibleLabelIndices = labels.reduce<number[]>(
		(indices, _label, index) => {
			const isFirst = index === 0;
			const isLast = index === labels.length - 1;
			const isIntervalLabel = index % labelInterval === 0;

			if (!isFirst && !isLast && !isIntervalLabel) {
				return indices;
			}

			if (
				isLast &&
				indices.length > 0 &&
				index - indices[indices.length - 1] < labelInterval
			) {
				indices[indices.length - 1] = index;
				return indices;
			}

			indices.push(index);
			return indices;
		},
		[],
	);
	const visibleLabelIndexSet = new Set(visibleLabelIndices);
	const peakLabel =
		peakIndex >= 0 ? (labels[peakIndex] ?? "Peak day") : "Peak day";

	return (
		<div className="space-y-4">
			<div className="rounded-[1.75rem] border border-border/60 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.14),_transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0))] p-4">
				<div className="mb-4 flex flex-wrap items-start justify-between gap-3">
					<div>
						<p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
							Peak Day
						</p>
						<p className="mt-1 text-sm font-medium">{peakLabel}</p>
					</div>
					<div className="text-right">
						<p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
							Highest Net
						</p>
						<p className="mt-1 text-sm font-semibold">
							{formatNumber(maxValue, 0)} {unit}
						</p>
					</div>
					<div className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-[11px] font-medium text-violet-200">
						{activeDays} active {activeDays === 1 ? "day" : "days"}
					</div>
				</div>
				<div className="relative overflow-hidden rounded-2xl border border-border/60 bg-background/40 px-4 pb-4 pt-6">
					<div className="pointer-events-none absolute inset-x-4 top-6 bottom-10">
						{[0, 1, 2, 3].map((line) => (
							<div
								key={`grid-${line}`}
								className="absolute inset-x-0 border-t border-border/50"
								style={{ top: `${line * 33.333}%` }}
							/>
						))}
					</div>
					<div className="grid min-h-56 grid-cols-[repeat(auto-fit,minmax(16px,1fr))] items-end gap-2">
						{values.map((value, index) => {
							const label = labels[index] ?? `bar-${value}`;
							const height = `${Math.max((value / maxValue) * 100, 6)}%`;
							const isPeak = index === peakIndex;
							const showValue = value > 0;
							const showLabel = visibleLabelIndexSet.has(index);
							return (
								<div
									key={`${label}-${value}`}
									className="relative flex h-full flex-col items-center justify-end gap-2"
								>
									<div className="h-6 text-xs text-muted-foreground">
										{showValue ? (
											<span
												className={
													isPeak
														? "rounded-full bg-violet-500/15 px-2 py-0.5 text-violet-100"
														: ""
												}
											>
												{formatNumber(value, 0)}
											</span>
										) : null}
									</div>
									<div
										className={
											isPeak
												? "w-full rounded-t-[0.9rem] bg-gradient-to-t from-violet-500 via-violet-400 to-fuchsia-300 shadow-[0_0_24px_rgba(139,92,246,0.25)] transition-all"
												: "w-full rounded-t-[0.9rem] bg-gradient-to-t from-violet-600/90 to-violet-400/85 transition-all"
										}
										style={{ height }}
									/>
									<div className="h-10 text-[11px] text-center text-muted-foreground">
										{showLabel ? (labels[index] ?? "") : ""}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}

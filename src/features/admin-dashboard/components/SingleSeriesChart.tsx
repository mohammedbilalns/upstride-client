import { buildLinePath, formatMaybeDateLabel } from "../utils";

interface SingleSeriesChartProps {
	labels: string[];
	values: number[];
	color: string;
}

export function SingleSeriesChart({
	labels,
	values,
	color,
}: SingleSeriesChartProps) {
	return (
		<div className="space-y-3">
			<div className="overflow-hidden rounded-2xl border border-border/70 bg-background/60 p-2.5">
				<svg
					viewBox="0 0 640 240"
					className="h-48 w-full text-foreground"
					role="img"
					aria-label="Revenue trend chart"
				>
					<title>Revenue trend chart</title>
					{[0, 1, 2, 3].map((line) => {
						const y = 24 + ((240 - 48) / 3) * line;
						return (
							<line
								key={y}
								x1={24}
								y1={y}
								x2={616}
								y2={y}
								stroke="currentColor"
								strokeOpacity="0.08"
							/>
						);
					})}
					<path
						d={buildLinePath(values, 640, 240)}
						fill="none"
						stroke={color}
						strokeWidth="3.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</div>
			<div className="grid grid-cols-4 gap-1.5 text-[11px] text-muted-foreground md:grid-cols-8">
				{labels.map((label) => (
					<span key={label} className="truncate">
						{formatMaybeDateLabel(label)}
					</span>
				))}
			</div>
		</div>
	);
}

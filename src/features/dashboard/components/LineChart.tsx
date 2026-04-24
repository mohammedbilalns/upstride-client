import type { DashboardActivityOverviewDto } from "../types";
import { buildDots, buildLinePath } from "../utils/dashboard.charts";
import { formatNumber } from "../utils/dashboard.formatters";

interface LineChartProps {
	overview: DashboardActivityOverviewDto;
}

export function LineChart({ overview }: LineChartProps) {
	const width = 640;
	const height = 220;
	const padding = 18;
	const path1 = buildLinePath(overview.sessions, width, height, padding);
	const path2 = buildLinePath(overview.hoursLearned, width, height, padding);
	const maxValue = Math.max(...overview.sessions, ...overview.hoursLearned, 1);

	return (
		<div className="space-y-2.5">
			<div className="overflow-hidden rounded-2xl border border-border/60 bg-muted/10">
				<svg
					viewBox={`0 0 ${width} ${height}`}
					className="h-[12.5rem] w-full"
					role="img"
					aria-label="Dashboard activity overview chart"
				>
					{[0, 1, 2, 3].map((line) => {
						const y = padding + ((height - padding * 2) / 3) * line;
						return (
							<line
								key={`grid-line-${y}`}
								x1={padding}
								y1={y}
								x2={width - padding}
								y2={y}
								stroke="currentColor"
								strokeOpacity="0.08"
								strokeWidth="1"
							/>
						);
					})}
					{path1 && (
						<path
							d={path1}
							fill="none"
							stroke="#3b82f6"
							strokeWidth="4"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					)}
					{path2 && (
						<path
							d={path2}
							fill="none"
							stroke="#8b5cf6"
							strokeWidth="4"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					)}
					{buildDots(overview.sessions, width, height, padding, "#3b82f6")}
					{buildDots(overview.hoursLearned, width, height, padding, "#8b5cf6")}
				</svg>
			</div>
			<div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
				{overview.labels.map((label) => (
					<span key={label}>{label}</span>
				))}
				<span className="ml-auto">Peak: {formatNumber(maxValue, 1)}</span>
			</div>
		</div>
	);
}

import type { DashboardActivityOverviewDto } from "../types";
import { buildDots, buildLinePath } from "../utils/dashboard.charts";
import { formatNumber } from "../utils/dashboard.formatters";

interface LineChartProps {
	overview: DashboardActivityOverviewDto;
}

export function LineChart({ overview }: LineChartProps) {
	const width = 920;
	const height = 320;
	const paddingTop = 24;
	const paddingRight = 24;
	const paddingBottom = 52;
	const paddingLeft = 52;
	const chartPadding = 0;
	const chartWidth = width - paddingLeft - paddingRight;
	const chartHeight = height - paddingTop - paddingBottom;
	const maxValue = Math.max(...overview.sessions, ...overview.hoursLearned, 1);
	const tickCount = 4;
	const xStep =
		overview.labels.length > 1 ? chartWidth / (overview.labels.length - 1) : 0;
	const maxVisibleLabels = 8;
	const labelInterval = Math.max(
		1,
		Math.ceil(overview.labels.length / maxVisibleLabels),
	);
	const visibleLabelIndices = overview.labels.reduce<number[]>(
		(indices, _label, index) => {
			const isFirst = index === 0;
			const isLast = index === overview.labels.length - 1;
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
	const path1 = buildLinePath(
		overview.sessions,
		chartWidth,
		chartHeight,
		chartPadding,
		maxValue,
	);
	const path2 = buildLinePath(
		overview.hoursLearned,
		chartWidth,
		chartHeight,
		chartPadding,
		maxValue,
	);

	return (
		<div>
			<div className="overflow-hidden rounded-2xl border border-border/60 bg-muted/10">
				<svg
					viewBox={`0 0 ${width} ${height}`}
					className="h-[18rem] w-full md:h-[20rem]"
					role="img"
					aria-label="Dashboard activity overview chart"
				>
					{Array.from({ length: tickCount + 1 }, (_, index) => {
						const tickValue = maxValue - (maxValue / tickCount) * index;
						const y = paddingTop + (chartHeight / tickCount) * index;
						return (
							<g key={`grid-line-${y}`}>
								<line
									x1={paddingLeft}
									y1={y}
									x2={width - paddingRight}
									y2={y}
									stroke="currentColor"
									strokeOpacity="0.08"
									strokeWidth="1"
								/>
								<text
									x={paddingLeft - 10}
									y={y + 4}
									fill="currentColor"
									fontSize="11"
									textAnchor="end"
									opacity="0.7"
								>
									{formatNumber(tickValue, tickValue < 10 ? 1 : 0)}
								</text>
							</g>
						);
					})}
					<line
						x1={paddingLeft}
						y1={paddingTop + chartHeight}
						x2={width - paddingRight}
						y2={paddingTop + chartHeight}
						stroke="currentColor"
						strokeOpacity="0.14"
						strokeWidth="1"
					/>
					<line
						x1={paddingLeft}
						y1={paddingTop}
						x2={paddingLeft}
						y2={paddingTop + chartHeight}
						stroke="currentColor"
						strokeOpacity="0.14"
						strokeWidth="1"
					/>
					<g transform={`translate(${paddingLeft}, ${paddingTop})`}>
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
						{buildDots(
							overview.sessions,
							chartWidth,
							chartHeight,
							chartPadding,
							"#3b82f6",
							maxValue,
						)}
						{buildDots(
							overview.hoursLearned,
							chartWidth,
							chartHeight,
							chartPadding,
							"#8b5cf6",
							maxValue,
						)}
					</g>
					{overview.labels.map((label, index) => {
						if (!visibleLabelIndexSet.has(index)) {
							return null;
						}

						return (
							<g key={label}>
								<line
									x1={paddingLeft + index * xStep}
									y1={paddingTop + chartHeight}
									x2={paddingLeft + index * xStep}
									y2={paddingTop + chartHeight + 6}
									stroke="currentColor"
									strokeOpacity="0.14"
									strokeWidth="1"
								/>
								<text
									x={paddingLeft + index * xStep}
									y={height - 20}
									fill="currentColor"
									fontSize="11"
									textAnchor={
										index === 0
											? "start"
											: index === overview.labels.length - 1
												? "end"
												: "middle"
									}
									opacity="0.7"
								>
									{label}
								</text>
							</g>
						);
					})}
					<text
						x={width / 2}
						y={height - 4}
						fill="currentColor"
						fontSize="11"
						textAnchor="middle"
						opacity="0.55"
					>
						Time
					</text>
					<text
						x={16}
						y={height / 2}
						fill="currentColor"
						fontSize="11"
						textAnchor="middle"
						opacity="0.55"
						transform={`rotate(-90 16 ${height / 2})`}
					>
						Sessions / Hours
					</text>
				</svg>
			</div>
			<div className="mt-2 flex items-center justify-end text-[11px] text-muted-foreground">
				<span>Peak: {formatNumber(maxValue, 1)}</span>
			</div>
		</div>
	);
}

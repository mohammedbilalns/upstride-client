import type { AdminDashboardUserGrowthResponse } from "../types";
import { buildLinePath, formatMaybeDateLabel, numberFormatter } from "../utils";

interface DualSeriesChartProps {
	data: AdminDashboardUserGrowthResponse;
}

export function DualSeriesChart({ data }: DualSeriesChartProps) {
	const width = 920;
	const height = 270;
	const paddingTop = 20;
	const paddingRight = 24;
	const paddingBottom = 42;
	const paddingLeft = 44;
	const chartWidth = width - paddingLeft - paddingRight;
	const chartHeight = height - paddingTop - paddingBottom;
	const userValues = data.series.map((item) => item.users);
	const mentorValues = data.series.map((item) => item.mentors);
	const minValue = 0;
	const maxValue = Math.max(...userValues, ...mentorValues, 1);
	const tickCount = 4;
	const xStep =
		data.labels.length > 1 ? chartWidth / (data.labels.length - 1) : 0;
	const maxVisibleLabels = 8;
	const labelInterval = Math.max(
		1,
		Math.ceil(data.labels.length / maxVisibleLabels),
	);
	const visibleLabelIndices = data.labels.reduce<number[]>(
		(indices, _label, index) => {
			const isFirst = index === 0;
			const isLast = index === data.labels.length - 1;
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
	const userPath = buildLinePath(userValues, chartWidth, chartHeight, {
		padding: 0,
		minValue,
		maxValue,
	});
	const mentorPath = buildLinePath(mentorValues, chartWidth, chartHeight, {
		padding: 0,
		minValue,
		maxValue,
	});

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-4 text-[11px] text-muted-foreground">
				<div className="flex items-center gap-2">
					<span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
					Users
				</div>
				<div className="flex items-center gap-2">
					<span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
					Mentors
				</div>
			</div>
			<div className="overflow-hidden rounded-2xl border border-border/70 bg-background/60 p-2.5">
				<svg
					viewBox={`0 0 ${width} ${height}`}
					className="h-60 w-full text-foreground"
					role="img"
					aria-label="User and mentor growth chart"
				>
					<title>User and mentor growth chart</title>
					{Array.from({ length: tickCount + 1 }, (_, index) => {
						const tickValue = maxValue - (maxValue / tickCount) * index;
						const y = paddingTop + (chartHeight / tickCount) * index;
						return (
							<g key={`grid-${y}`}>
								<line
									x1={paddingLeft}
									y1={y}
									x2={width - paddingRight}
									y2={y}
									stroke="currentColor"
									strokeOpacity="0.08"
								/>
								<text
									x={paddingLeft - 10}
									y={y + 4}
									fill="currentColor"
									fontSize="11"
									textAnchor="end"
									opacity="0.7"
								>
									{numberFormatter.format(Math.round(tickValue))}
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
					/>
					<line
						x1={paddingLeft}
						y1={paddingTop}
						x2={paddingLeft}
						y2={paddingTop + chartHeight}
						stroke="currentColor"
						strokeOpacity="0.14"
					/>
					<g transform={`translate(${paddingLeft}, ${paddingTop})`}>
						<path
							d={userPath}
							fill="none"
							stroke="#0ea5e9"
							strokeWidth="3.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
						<path
							d={mentorPath}
							fill="none"
							stroke="#8b5cf6"
							strokeWidth="3.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</g>
					{data.labels.map((label, index) => {
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
								/>
								<text
									x={paddingLeft + index * xStep}
									y={height - 20}
									fill="currentColor"
									fontSize="11"
									textAnchor={
										index === 0
											? "start"
											: index === data.labels.length - 1
												? "end"
												: "middle"
									}
									opacity="0.7"
								>
									{formatMaybeDateLabel(label)}
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
						Users / Mentors
					</text>
				</svg>
			</div>
		</div>
	);
}

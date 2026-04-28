import {
	Activity,
	ArrowDownRight,
	ArrowUpRight,
	CalendarDays,
	CircleDollarSign,
	Database,
	RefreshCcw,
	Server,
} from "lucide-react";
import { type ComponentType, useMemo, useState } from "react";
import ErrorComponent from "@/components/common/ErrorComponent";
import PendingComponent from "@/components/common/PendingComponent";
import { Button } from "@/components/ui/Button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select";
import { cn } from "@/shared/utils/cn";
import {
	useAdminDashboard,
	useAdminDashboardRevenueAnalytics,
	useAdminDashboardSessionOverview,
	useAdminDashboardUserGrowth,
} from "../hooks/queries/useAdminDashboard";
import type {
	AdminDashboardChartQuery,
	AdminDashboardPeriod,
	AdminDashboardSessionOverviewResponse,
	AdminDashboardUserGrowthResponse,
	HealthCheckResult,
} from "../types";

const FILTER_OPTIONS: { label: string; value: AdminDashboardPeriod }[] = [
	{ label: "This Week", value: "week" },
	{ label: "This Month", value: "month" },
	{ label: "This Year", value: "year" },
	{ label: "Custom", value: "custom" },
];

const currency = new Intl.NumberFormat("en-IN", {
	style: "currency",
	currency: "INR",
	maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-IN");
const today = new Date().toISOString().slice(0, 10);

const percent = (value: number) =>
	`${value > 0 ? "+" : ""}${value.toFixed(1)}%`;

const formatDisplayDate = (value: string) => {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
		return value;
	}

	const [year, month, day] = value.split("-");
	return `${day}/${month}/${year.slice(-2)}`;
};

const formatMaybeDateLabel = (value: string) => formatDisplayDate(value);

const getComparisonLabel = (
	period: AdminDashboardPeriod,
	startDate?: string,
	endDate?: string,
) => {
	if (period === "custom" && startDate && endDate) {
		return `vs ${formatDisplayDate(startDate)} to ${formatDisplayDate(endDate)}`;
	}

	switch (period) {
		case "week":
			return "vs last week";
		case "year":
			return "vs last year";
		case "custom":
		case "month":
		default:
			return "vs last month";
	}
};

const getDateRangeError = (startDate: string, endDate: string) => {
	if (!startDate || !endDate) {
		return "";
	}

	if (startDate > today || endDate > today) {
		return "Future dates are not allowed.";
	}

	if (startDate > endDate) {
		return "Start date must be before or equal to end date.";
	}

	return "";
};

const formatCompact = (value: number) => {
	if (value >= 100000) {
		return `${(value / 100000).toFixed(1)}L`;
	}
	if (value >= 1000) {
		return `${(value / 1000).toFixed(1)}K`;
	}

	return numberFormatter.format(value);
};

const formatDuration = (totalSeconds: number) => {
	const safeSeconds = Math.max(0, Math.floor(totalSeconds));
	const hours = Math.floor(safeSeconds / 3600);
	const minutes = Math.floor((safeSeconds % 3600) / 60);
	const seconds = safeSeconds % 60;

	const parts = [];

	if (hours > 0) {
		parts.push(`${hours}h`);
	}

	if (hours > 0 || minutes > 0) {
		parts.push(`${minutes}m`);
	}

	parts.push(`${seconds}s`);

	return parts.join(" ");
};

const buildLinePath = (
	values: number[],
	width: number,
	height: number,
	options?: {
		padding?: number;
		minValue?: number;
		maxValue?: number;
	},
) => {
	if (values.length === 0) return "";
	const padding = options?.padding ?? 16;
	const chartWidth = width - padding * 2;
	const chartHeight = height - padding * 2;
	const minValue = options?.minValue ?? Math.min(...values);
	const maxValue = options?.maxValue ?? Math.max(...values);
	const range = maxValue - minValue || 1;
	const step = values.length === 1 ? 0 : chartWidth / (values.length - 1);

	return values
		.map((value, index) => {
			const x = padding + index * step;
			const y =
				padding + chartHeight - ((value - minValue) / range) * chartHeight;
			return `${index === 0 ? "M" : "L"} ${x} ${y}`;
		})
		.join(" ");
};

const buildDonutGradient = (
	slices: Array<{ value: number; color: string }>,
	total: number,
) => {
	let start = 0;
	const safeTotal = total || 1;

	return slices
		.map((slice) => {
			const size = (slice.value / safeTotal) * 100;
			const segment = `${slice.color} ${start}% ${start + size}%`;
			start += size;
			return segment;
		})
		.join(", ");
};

function MetricCard({
	title,
	value,
	changePercent,
	subtitle,
	icon: Icon,
	sparkline,
	chartColor,
}: {
	title: string;
	value: string;
	changePercent: number;
	subtitle: string;
	icon: ComponentType<{ className?: string }>;
	sparkline: number[];
	chartColor: string;
}) {
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
					<svg viewBox="0 0 320 90" className="h-14 w-full">
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

function TrendIndicator({ value, label }: { value: number; label: string }) {
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

function FilterControl({
	value,
	onChange,
	startDate,
	endDate,
	onStartDateChange,
	onEndDateChange,
	onApply,
	disabled,
	error,
}: {
	value: AdminDashboardPeriod;
	onChange: (value: AdminDashboardPeriod) => void;
	startDate: string;
	endDate: string;
	onStartDateChange: (value: string) => void;
	onEndDateChange: (value: string) => void;
	onApply: () => void;
	disabled: boolean;
	error?: string;
}) {
	return (
		<div className="flex flex-col items-stretch gap-2 md:items-end">
			<div className="flex flex-wrap items-center justify-end gap-2">
				<Select
					value={value}
					onValueChange={(next) => onChange(next as AdminDashboardPeriod)}
				>
					<SelectTrigger className="min-w-32 border-border bg-background/70 text-foreground">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{FILTER_OPTIONS.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{value === "custom" ? (
					<>
						<Input
							type="date"
							value={startDate}
							onChange={(event) => onStartDateChange(event.target.value)}
							max={today}
							className="w-36 border-border bg-background/70 text-foreground"
						/>
						<Input
							type="date"
							value={endDate}
							onChange={(event) => onEndDateChange(event.target.value)}
							min={startDate || undefined}
							max={today}
							className="w-36 border-border bg-background/70 text-foreground"
						/>
						<Button
							variant="outline"
							size="sm"
							onClick={onApply}
							disabled={disabled}
							className="border-border bg-background/70 text-foreground hover:bg-muted"
						>
							Apply
						</Button>
					</>
				) : null}
			</div>
			{value === "custom" && error ? (
				<p className="text-right text-xs text-rose-500">{error}</p>
			) : null}
		</div>
	);
}

function DualSeriesChart({ data }: { data: AdminDashboardUserGrowthResponse }) {
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
				>
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

function SingleSeriesChart({
	labels,
	values,
	color,
}: {
	labels: string[];
	values: number[];
	color: string;
}) {
	return (
		<div className="space-y-3">
			<div className="overflow-hidden rounded-2xl border border-border/70 bg-background/60 p-2.5">
				<svg viewBox="0 0 640 240" className="h-48 w-full text-foreground">
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

function SessionOverviewPanel({
	overview,
}: {
	overview: AdminDashboardSessionOverviewResponse;
}) {
	const slices = [
		{ label: "Completed", value: overview.completed, color: "#22c55e" },
		{ label: "Upcoming", value: overview.upcoming, color: "#3b82f6" },
		{ label: "Cancelled", value: overview.cancelled, color: "#ef4444" },
	];

	return (
		<Card className="gap-0 border-border/70 bg-card/95 shadow-sm">
			<CardHeader className="flex flex-row items-center justify-between px-4 pt-4">
				<div>
					<CardTitle className="text-lg">Session Overview</CardTitle>
				</div>
			</CardHeader>
			<CardContent className="px-4 pb-4">
				<div className="grid gap-4 lg:grid-cols-[200px_1fr]">
					<div className="flex items-center justify-center">
						<div
							className="relative flex h-40 w-40 items-center justify-center rounded-full"
							style={{
								background: `conic-gradient(${buildDonutGradient(
									slices,
									overview.totalSessions,
								)})`,
							}}
						>
							<div className="flex h-28 w-28 flex-col items-center justify-center rounded-full border border-border bg-card text-center">
								<p className="text-3xl font-semibold">
									{numberFormatter.format(overview.totalSessions)}
								</p>
								<p className="text-xs text-muted-foreground">Total Sessions</p>
							</div>
						</div>
					</div>
					<div className="space-y-3">
						<div className="grid gap-3 md:grid-cols-3">
							{slices.map((slice) => (
								<div
									key={slice.label}
									className="rounded-2xl border border-border/70 bg-background/60 px-3 py-2.5 text-sm"
								>
									<div className="flex items-center gap-3">
										<span
											className="h-3 w-3 rounded-full"
											style={{ backgroundColor: slice.color }}
										/>
										<span>{slice.label}</span>
									</div>
									<span className="mt-2 block text-muted-foreground">
										{numberFormatter.format(slice.value)} (
										{overview.totalSessions > 0
											? Math.round((slice.value / overview.totalSessions) * 100)
											: 0}
										%)
									</span>
								</div>
							))}
						</div>
						<div className="grid gap-2.5 sm:grid-cols-2">
							<div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3">
								<p className="text-xs uppercase tracking-[0.16em] text-emerald-500">
									Completion Rate
								</p>
								<p className="mt-1 text-2xl font-semibold">
									{overview.completionRate.toFixed(1)}%
								</p>
							</div>
							<div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3">
								<p className="text-xs uppercase tracking-[0.16em] text-rose-500">
									Cancellation Rate
								</p>
								<p className="mt-1 text-2xl font-semibold">
									{overview.cancellationRate.toFixed(1)}%
								</p>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function HealthStatusRow({
	label,
	result,
	icon: Icon,
}: {
	label: string;
	result: HealthCheckResult;
	icon: ComponentType<{ className?: string }>;
}) {
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

export function AdminDashboardPage() {
	const dashboardQuery = useAdminDashboard();
	const sessionOverviewQuery = useAdminDashboardSessionOverview();

	const [userGrowthFilter, setUserGrowthFilter] =
		useState<AdminDashboardChartQuery>({
			period: "month",
		});
	const [userGrowthDraft, setUserGrowthDraft] = useState({
		startDate: "",
		endDate: "",
	});

	const [revenueFilter, setRevenueFilter] = useState<AdminDashboardChartQuery>({
		period: "month",
	});
	const [revenueDraft, setRevenueDraft] = useState({
		startDate: "",
		endDate: "",
	});

	const userGrowthDateError = getDateRangeError(
		userGrowthDraft.startDate,
		userGrowthDraft.endDate,
	);
	const revenueDateError = getDateRangeError(
		revenueDraft.startDate,
		revenueDraft.endDate,
	);
	const userGrowthComparisonLabel = getComparisonLabel(
		userGrowthFilter.period,
		userGrowthFilter.startDate,
		userGrowthFilter.endDate,
	);
	const revenueComparisonLabel = getComparisonLabel(
		revenueFilter.period,
		revenueFilter.startDate,
		revenueFilter.endDate,
	);

	const userGrowthQuery = useAdminDashboardUserGrowth(
		userGrowthFilter,
		userGrowthFilter.period !== "custom" ||
			Boolean(userGrowthFilter.startDate && userGrowthFilter.endDate),
	);
	const revenueAnalyticsQuery = useAdminDashboardRevenueAnalytics(
		revenueFilter,
		revenueFilter.period !== "custom" ||
			Boolean(revenueFilter.startDate && revenueFilter.endDate),
	);

	const dashboard = dashboardQuery.data;

	const userGrowth = userGrowthQuery.data;
	const revenueAnalytics = revenueAnalyticsQuery.data;
	const sessionOverview = sessionOverviewQuery.data;

	const metricCards = useMemo(() => {
		if (!dashboard || !revenueAnalytics) {
			return [];
		}

		const sessionTrend = [
			dashboard.metrics.totalSessions.previous,
			dashboard.metrics.totalSessions.current,
			dashboard.metrics.totalSessions.total,
		];
		return [
			{
				title: "Total Sessions",
				value: numberFormatter.format(dashboard.metrics.totalSessions.total),
				changePercent: dashboard.metrics.totalSessions.changePercent,
				subtitle: "Completed, upcoming and cancelled",
				icon: CalendarDays,
				sparkline: sessionTrend,
				chartColor: "#22c55e",
			},
			{
				title: "Total Revenue",
				value: currency.format(dashboard.metrics.totalRevenue.total),
				changePercent: dashboard.metrics.totalRevenue.changePercent,
				subtitle: "Historical revenue analytics",
				icon: CircleDollarSign,
				sparkline: revenueAnalytics.series.map((item) => item.value),
				chartColor: "#f59e0b",
			},
		];
	}, [dashboard, revenueAnalytics]);

	if (dashboardQuery.isLoading && !dashboard) {
		return <PendingComponent resource="admin dashboard" />;
	}

	if (dashboardQuery.isError || !dashboard) {
		return (
			<ErrorComponent
				error={
					dashboardQuery.error instanceof Error
						? dashboardQuery.error
						: new Error("Failed to load admin dashboard")
				}
			/>
		);
	}

	return (
		<div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.08),transparent_28%),linear-gradient(180deg,hsl(var(--background))_0%,hsl(var(--background))_100%)] px-3 py-4 text-foreground sm:px-5 lg:px-6">
			<div className="mx-auto max-w-7xl space-y-3.5">
				<div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
						<p className="mt-1 text-sm text-muted-foreground">
							Operational metrics, revenue signals, and backend health in one
							view.
						</p>
					</div>
				</div>

				<div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-2">
					{metricCards.map((card) => (
						<MetricCard key={card.title} {...card} />
					))}
				</div>

				<div className="space-y-3.5">
					<Card className="gap-0 border-border/70 bg-card/95 shadow-sm">
						<CardHeader className="flex flex-col gap-3 px-4 pt-4 md:flex-row md:items-start md:justify-between">
							<div>
								<CardTitle className="text-lg">User Growth</CardTitle>
								<CardDescription>Users and mentors over time</CardDescription>
							</div>
							<FilterControl
								value={userGrowthFilter.period}
								onChange={(value) => {
									setUserGrowthFilter(
										value === "custom" ? { period: value } : { period: value },
									);
								}}
								startDate={userGrowthDraft.startDate}
								endDate={userGrowthDraft.endDate}
								onStartDateChange={(value) =>
									setUserGrowthDraft((current) => ({
										...current,
										startDate: value,
									}))
								}
								onEndDateChange={(value) =>
									setUserGrowthDraft((current) => ({
										...current,
										endDate: value,
									}))
								}
								onApply={() =>
									setUserGrowthFilter({
										period: "custom",
										startDate: userGrowthDraft.startDate,
										endDate: userGrowthDraft.endDate,
									})
								}
								disabled={
									!userGrowthDraft.startDate ||
									!userGrowthDraft.endDate ||
									Boolean(userGrowthDateError)
								}
								error={userGrowthDateError}
							/>
						</CardHeader>
						<CardContent className="px-4 pb-4">
							{userGrowth ? <DualSeriesChart data={userGrowth} /> : null}
							<div className="mt-3 grid gap-2.5 sm:grid-cols-2">
								<div className="rounded-2xl border border-border/70 bg-background/60 p-3">
									<p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
										Users
									</p>
									<p className="mt-1 text-2xl font-semibold">
										{numberFormatter.format(dashboard.metrics.totalUsers.total)}
									</p>
									<TrendIndicator
										value={dashboard.metrics.totalUsers.changePercent}
										label={userGrowthComparisonLabel}
									/>
								</div>
								<div className="rounded-2xl border border-border/70 bg-background/60 p-3">
									<p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
										Mentors
									</p>
									<p className="mt-1 text-2xl font-semibold">
										{numberFormatter.format(
											dashboard.metrics.totalMentors.total,
										)}
									</p>
									<TrendIndicator
										value={dashboard.metrics.totalMentors.changePercent}
										label={userGrowthComparisonLabel}
									/>
								</div>
							</div>
						</CardContent>
					</Card>

					{sessionOverview ? (
						<SessionOverviewPanel overview={sessionOverview} />
					) : null}

					<Card className="gap-0 border-border/70 bg-card/95 shadow-sm">
						<CardHeader className="flex flex-col gap-3 px-4 pt-4 md:flex-row md:items-start md:justify-between">
							<div>
								<CardTitle className="text-lg">Revenue Analytics</CardTitle>
								<CardDescription>
									Effective platform revenue over time
								</CardDescription>
							</div>
							<FilterControl
								value={revenueFilter.period}
								onChange={(value) => {
									setRevenueFilter(
										value === "custom" ? { period: value } : { period: value },
									);
								}}
								startDate={revenueDraft.startDate}
								endDate={revenueDraft.endDate}
								onStartDateChange={(value) =>
									setRevenueDraft((current) => ({
										...current,
										startDate: value,
									}))
								}
								onEndDateChange={(value) =>
									setRevenueDraft((current) => ({ ...current, endDate: value }))
								}
								onApply={() =>
									setRevenueFilter({
										period: "custom",
										startDate: revenueDraft.startDate,
										endDate: revenueDraft.endDate,
									})
								}
								disabled={
									!revenueDraft.startDate ||
									!revenueDraft.endDate ||
									Boolean(revenueDateError)
								}
								error={revenueDateError}
							/>
						</CardHeader>
						<CardContent className="px-4 pb-4">
							{revenueAnalytics ? (
								<SingleSeriesChart
									labels={revenueAnalytics.labels}
									values={revenueAnalytics.series.map((item) => item.value)}
									color="#f59e0b"
								/>
							) : null}
							{revenueAnalytics ? (
								<div className="mt-3 grid gap-2.5 sm:grid-cols-3">
									<div className="rounded-2xl border border-border/70 bg-background/60 p-3">
										<p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
											Effective Revenue
										</p>
										<p className="mt-1 text-xl font-semibold">
											{currency.format(
												revenueAnalytics.breakdown.effectiveRevenue,
											)}
										</p>
										<p className="mt-1 text-xs text-muted-foreground">
											{revenueComparisonLabel}
										</p>
									</div>
									<div className="rounded-2xl border border-border/70 bg-background/60 p-3">
										<p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
											Platform Wallet Balance
										</p>
										<p className="mt-1 text-xl font-semibold">
											{currency.format(
												revenueAnalytics.breakdown.platformWalletBalance,
											)}
										</p>
										<p className="mt-1 text-xs text-muted-foreground">
											{revenueComparisonLabel}
										</p>
									</div>
									<div className="rounded-2xl border border-border/70 bg-background/60 p-3">
										<p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
											Upcoming Session Liability
										</p>
										<p className="mt-1 text-xl font-semibold">
											{currency.format(
												revenueAnalytics.breakdown.upcomingSessionLiability,
											)}
										</p>
										<p className="mt-1 text-xs text-muted-foreground">
											{revenueComparisonLabel}
										</p>
									</div>
								</div>
							) : null}
						</CardContent>
					</Card>
				</div>

				<div className="grid gap-3 xl:grid-cols-3">
					<Card className="gap-0 border-border/70 bg-card/95 shadow-sm">
						<CardHeader className="px-4 pt-4">
							<CardTitle className="text-lg">Top Mentors By Revenue</CardTitle>
							<CardDescription>Current top earning mentors</CardDescription>
						</CardHeader>
						<CardContent className="px-4 pb-4">
							<div className="space-y-2.5">
								{dashboard.topMentors.map((mentor, index) => (
									<div
										key={mentor.mentorId}
										className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 px-3 py-2.5"
									>
										<div className="flex items-center gap-3">
											<span className="text-sm text-muted-foreground">
												{index + 1}
											</span>
											<div>
												<p className="text-sm font-medium">{mentor.name}</p>
												<p className="text-xs text-emerald-500">
													{percent(mentor.changePercent)}
												</p>
											</div>
										</div>
										<p className="text-sm font-semibold">
											{currency.format(mentor.revenue)}
										</p>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					<Card className="gap-0 border-border/70 bg-card/95 shadow-sm">
						<CardHeader className="px-4 pt-4">
							<CardTitle className="text-lg">
								Top Categories By Sessions
							</CardTitle>
							<CardDescription>
								Session distribution by expertise
							</CardDescription>
						</CardHeader>
						<CardContent className="px-4 pb-4">
							<div className="space-y-3">
								{dashboard.topCategories.map((category) => (
									<div key={category.categoryId} className="space-y-2">
										<div className="flex items-center justify-between text-sm">
											<span>{category.name}</span>
											<span className="text-muted-foreground">
												{formatCompact(category.sessions)} (
												{category.sharePercent.toFixed(1)}%)
											</span>
										</div>
										<div className="h-2 overflow-hidden rounded-full bg-muted">
											<div
												className="h-full rounded-full bg-linear-to-r from-primary to-sky-500"
												style={{
													width: `${Math.max(category.sharePercent, 6)}%`,
												}}
											/>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					<Card className="gap-0 border-border/70 bg-card/95 shadow-sm">
						<CardHeader className="px-4 pt-4">
							<div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
								<div>
									<CardTitle className="text-lg">System Health</CardTitle>
								</div>
								{/* <Button */}
								{/* 	variant="outline" */}
								{/* 	size="sm" */}
								{/* 	onClick={() => { */}
								{/* 		void dashboardQuery.refetch(); */}
								{/* 		void sessionOverviewQuery.refetch(); */}
								{/* 	}} */}
								{/* 	disabled={isRefreshingHealth} */}
								{/* 	className="border-border bg-background/70" */}
								{/* > */}
								{/* 	<RefreshCcw */}
								{/* 		className={cn( */}
								{/* 			"h-4 w-4", */}
								{/* 			isRefreshingHealth && "animate-spin", */}
								{/* 		)} */}
								{/* 	/> */}
								{/* 	Recheck */}
								{/* </Button> */}
							</div>
						</CardHeader>
						<CardContent className="space-y-2.5 px-4 pb-4">
							<div className="flex items-center gap-2 rounded-2xl border border-border/70 bg-background/60 px-4 py-3 text-sm text-muted-foreground">
								<RefreshCcw className="h-4 w-4 text-primary" />
								<span>
									Last health snapshot:{" "}
									{formatDisplayDate(
										new Date(dashboard.systemHealth.timestamp)
											.toISOString()
											.slice(0, 10),
									)}
								</span>
							</div>
							<HealthStatusRow
								label="MongoDB"
								result={dashboard.systemHealth.dependencies.mongo}
								icon={Database}
							/>
							<HealthStatusRow
								label="Redis"
								result={dashboard.systemHealth.dependencies.redis}
								icon={Server}
							/>
							<HealthStatusRow
								label="Notification Queue"
								result={dashboard.systemHealth.services.notificationQueue}
								icon={Activity}
							/>
							<div className="rounded-3xl border border-border/70 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.16),transparent_45%),hsl(var(--background))] p-4 text-center">
								<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
									<Activity className="h-7 w-7 text-emerald-500" />
								</div>
								<p className="mt-3 text-base font-semibold">
									{dashboard.systemHealth.status === "ok"
										? "All Systems Operational"
										: "System Needs Attention"}
								</p>
								<p className="mt-1.5 text-sm text-muted-foreground">
									Uptime {formatDuration(dashboard.systemHealth.uptimeSeconds)}
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

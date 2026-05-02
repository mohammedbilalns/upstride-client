import type { AdminDashboardPeriod } from "./types";

export const FILTER_OPTIONS: { label: string; value: AdminDashboardPeriod }[] =
	[
		{ label: "This Week", value: "week" },
		{ label: "This Month", value: "month" },
		{ label: "This Year", value: "year" },
		{ label: "Custom", value: "custom" },
	];

export const currency = new Intl.NumberFormat("en-IN", {
	style: "currency",
	currency: "INR",
	maximumFractionDigits: 0,
});

export const numberFormatter = new Intl.NumberFormat("en-IN");
export const today = new Date().toISOString().slice(0, 10);

export const percent = (value: number) =>
	`${value > 0 ? "+" : ""}${value.toFixed(1)}%`;

export const formatDisplayDate = (value: string) => {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
		return value;
	}

	const [year, month, day] = value.split("-");
	return `${day}/${month}/${year.slice(-2)}`;
};

export const formatMaybeDateLabel = (value: string) => formatDisplayDate(value);

export const getComparisonLabel = (
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
		default:
			return "vs last month";
	}
};

export const getDateRangeError = (startDate: string, endDate: string) => {
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

export const formatCompact = (value: number) => {
	if (value >= 100000) {
		return `${(value / 100000).toFixed(1)}L`;
	}
	if (value >= 1000) {
		return `${(value / 1000).toFixed(1)}K`;
	}

	return numberFormatter.format(value);
};

export const formatDuration = (totalSeconds: number) => {
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

export const buildLinePath = (
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

export const buildDonutGradient = (
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

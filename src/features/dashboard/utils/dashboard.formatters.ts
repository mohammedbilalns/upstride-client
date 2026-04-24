import type { DashboardGrowthMetric } from "../types";

export function growthLabel(metric: DashboardGrowthMetric) {
	const direction = metric.changePercent >= 0 ? "up" : "down";
	const value = Math.abs(metric.changePercent).toFixed(0);
	return `${direction === "up" ? "↑" : "↓"} ${value}% vs last month`;
}

export function formatNumber(value: number, fractionDigits = 0) {
	return new Intl.NumberFormat(undefined, {
		minimumFractionDigits: fractionDigits,
		maximumFractionDigits: fractionDigits,
	}).format(value);
}

export function formatMoney(value: number, currency = "INR") {
	return new Intl.NumberFormat(undefined, {
		style: "currency",
		currency: currency.toUpperCase(),
		maximumFractionDigits: 0,
	}).format(value);
}

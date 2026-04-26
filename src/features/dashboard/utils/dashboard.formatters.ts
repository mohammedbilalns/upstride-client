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
	const normalizedCurrency = currency.toUpperCase();

	if (normalizedCurrency === "COINS") {
		return `${formatNumber(value)} COINS`;
	}

	try {
		return new Intl.NumberFormat(undefined, {
			style: "currency",
			currency: normalizedCurrency,
			maximumFractionDigits: 0,
		}).format(value);
	} catch {
		return `${formatNumber(value)} ${normalizedCurrency}`;
	}
}

export function formatUnitAmount(value: number, unit = "COINS") {
	return `${formatNumber(value)} ${unit.toUpperCase()}`;
}

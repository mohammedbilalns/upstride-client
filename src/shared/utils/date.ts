import { format } from "date-fns";

type DateInput = string | Date;

function toDate(value: DateInput): Date | null {
	const date = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(date.getTime())) return null;
	return date;
}

function formatWithPattern(value: DateInput, pattern: string): string {
	const date = toDate(value);
	if (!date) return typeof value === "string" ? value : "";
	return format(date, pattern);
}

export function formatDateShort(value: DateInput): string {
	return formatWithPattern(value, "MMM dd, yyyy");
}

export function formatDateMedium(value: DateInput): string {
	return formatWithPattern(value, "MMM d, yyyy");
}

export function formatDateLong(value: DateInput): string {
	return formatWithPattern(value, "MMMM d, yyyy");
}

export function formatTimeShort(value: DateInput): string {
	return formatWithPattern(value, "hh:mm a");
}

export function formatTimeWithSeconds24(value: DateInput): string {
	return formatWithPattern(value, "HH:mm:ss");
}

export function formatChatTimestamp(
	value: DateInput,
	opts?: { showDateIfNotToday?: boolean },
): string {
	const date = toDate(value);
	if (!date) return typeof value === "string" ? value : "";

	const time = date.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});
	if (!opts?.showDateIfNotToday) return time;

	const now = new Date();
	const isToday = date.toDateString() === now.toDateString();
	if (isToday) return time;

	return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function formatLocaleDateLong(value: DateInput): string {
	const date = toDate(value);
	if (!date) return typeof value === "string" ? value : "";
	return date.toLocaleDateString(undefined, {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export function formatLocaleTimeShort(value: DateInput): string {
	const date = toDate(value);
	if (!date) return typeof value === "string" ? value : "";
	return date.toLocaleTimeString(undefined, {
		hour: "2-digit",
		minute: "2-digit",
	});
}

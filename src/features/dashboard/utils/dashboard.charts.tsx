export function buildLinePath(
	values: number[],
	width: number,
	height: number,
	padding: number,
	maxValueOverride?: number,
) {
	if (values.length === 0) return "";

	const chartWidth = width - padding * 2;
	const chartHeight = height - padding * 2;
	const maxValue = maxValueOverride ?? Math.max(...values, 1);
	const step = values.length === 1 ? 0 : chartWidth / (values.length - 1);

	return values
		.map((value, index) => {
			const x = padding + index * step;
			const y = padding + chartHeight - (value / maxValue) * chartHeight;
			return `${index === 0 ? "M" : "L"} ${x} ${y}`;
		})
		.join(" ");
}

export function buildDots(
	values: number[],
	width: number,
	height: number,
	padding: number,
	color: string,
	maxValueOverride?: number,
) {
	if (values.length === 0) return null;

	const chartWidth = width - padding * 2;
	const chartHeight = height - padding * 2;
	const maxValue = maxValueOverride ?? Math.max(...values, 1);
	const step = values.length === 1 ? 0 : chartWidth / (values.length - 1);

	return values.map((value, index) => {
		const x = padding + index * step;
		const y = padding + chartHeight - (value / maxValue) * chartHeight;
		return (
			<circle
				key={`${color}-${x}-${y}-${value}`}
				cx={x}
				cy={y}
				r="4"
				fill={color}
			/>
		);
	});
}

export function buildDonutGradient(
	slices: { value: number; color: string }[],
	total: number,
) {
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
}

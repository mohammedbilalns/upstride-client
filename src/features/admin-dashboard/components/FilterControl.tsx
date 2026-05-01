import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select";
import type { AdminDashboardPeriod } from "../types";
import { FILTER_OPTIONS, today } from "../utils";

interface FilterControlProps {
	value: AdminDashboardPeriod;
	onChange: (value: AdminDashboardPeriod) => void;
	startDate: string;
	endDate: string;
	onStartDateChange: (value: string) => void;
	onEndDateChange: (value: string) => void;
	onApply: () => void;
	disabled: boolean;
	error?: string;
}

export function FilterControl({
	value,
	onChange,
	startDate,
	endDate,
	onStartDateChange,
	onEndDateChange,
	onApply,
	disabled,
	error,
}: FilterControlProps) {
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

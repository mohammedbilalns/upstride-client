import FieldError from "@/components/common/FieldError";
import { Label } from "@/components/ui/Label";
import type { DayOfWeek } from "@/features/availability/types";
import { getErrorMessage } from "@/shared/utils/formValidation";
import { cn } from "@/shared/utils/cn";
import type { AvailabilityFormApi } from "./CreateRuleForm";

interface CreateRuleDaysSelectorProps {
	form: AvailabilityFormApi;
	days: DayOfWeek[];
	onToggleDay: (day: DayOfWeek) => void;
}

export function CreateRuleDaysSelector({
	form,
	days,
	onToggleDay,
}: CreateRuleDaysSelectorProps) {
	return (
		<form.Field name="days">
			{/* FIX: type error */}
			{(field) => (
				<div className="space-y-3">
					<Label>Active Days</Label>
					<div className="flex flex-wrap gap-3">
						{days.map((day) => {
							const selected = form.state.values.days.includes(day);
							return (
								<button
									type="button"
									key={day}
									onClick={() => onToggleDay(day)}
									className={cn(
										"px-4 py-2 border rounded-full text-sm font-medium transition-colors",
										selected
											? "bg-primary text-primary-foreground border-primary"
											: "bg-background text-muted-foreground border-input hover:border-primary hover:text-foreground",
									)}
								>
									{day}
								</button>
							);
						})}
					</div>
					<FieldError message={getErrorMessage(field.state.meta.errors?.[0])} />
				</div>
			)}
		</form.Field>
	);
}

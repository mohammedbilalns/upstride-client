import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import type { BreakTime } from "@/features/availability/types";
import type { AvailabilityFormApi } from "./CreateRuleForm";

interface CreateRuleBreakTimesProps {
	form: AvailabilityFormApi;
	onAddBreakTime: () => void;
	onUpdateBreakTime: (
		index: number,
		field: keyof BreakTime,
		value: string,
	) => void;
	onRemoveBreakTime: (index: number) => void;
}

export function CreateRuleBreakTimes({
	form,
	onAddBreakTime,
	onUpdateBreakTime,
	onRemoveBreakTime,
}: CreateRuleBreakTimesProps) {
	return (
		<div className="flex flex-col gap-4 rounded-xl border bg-transparent p-4 sm:p-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<Label className="text-base font-semibold">Break Times</Label>
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="w-full sm:w-auto"
					disabled={(form.state.values.breakTimes?.length ?? 0) >= 5}
					onClick={onAddBreakTime}
				>
					<Plus className="h-4 w-4 mr-2" /> Add Break
				</Button>
			</div>
			{/* FIX: type error  */}
			<form.Subscribe selector={(state) => state.values.breakTimes}>
				{(breakTimes) =>
					!breakTimes?.length ? (
						<p className="text-sm text-muted-foreground">
							No breaks configured. You will be available consecutively.
						</p>
					) : (
						<div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
							{breakTimes.map((bt, i) => (
								<div
									key={`${bt.startTime}-${bt.endTime}`}
									className="flex flex-col gap-3 rounded-lg border bg-background p-3 sm:flex-row sm:items-center"
								>
									<Input
										type="time"
										value={bt.startTime}
										className="h-9 min-w-0"
										onChange={(e) =>
											onUpdateBreakTime(i, "startTime", e.target.value)
										}
									/>
									<span className="text-sm text-muted-foreground sm:text-base">
										to
									</span>
									<Input
										type="time"
										value={bt.endTime}
										className="h-9 min-w-0"
										onChange={(e) =>
											onUpdateBreakTime(i, "endTime", e.target.value)
										}
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="h-9 w-full shrink-0 text-rose-500 sm:w-9"
										onClick={() => onRemoveBreakTime(i)}
									>
										<X className="h-4 w-4" />
									</Button>
								</div>
							))}
						</div>
					)
				}
			</form.Subscribe>
		</div>
	);
}

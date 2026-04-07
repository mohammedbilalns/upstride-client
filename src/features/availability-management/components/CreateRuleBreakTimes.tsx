import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BreakTime } from "@/features/availability-management/types";
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
		<div className="space-y-3 p-4 border rounded-xl bg-muted/10">
			<div className="flex items-center justify-between">
				<Label className="text-base font-semibold">Break Times</Label>
				<Button variant="outline" size="sm" onClick={onAddBreakTime}>
					<Plus className="h-4 w-4 mr-2" /> Add Break
				</Button>
			</div>
			{!form.state.values.breakTimes?.length ? (
				<p className="text-sm text-muted-foreground">
					No breaks configured. You will be available consecutively.
				</p>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{form.state.values.breakTimes.map((bt, i) => (
						<div
							key={i}
							className="flex items-center gap-2 p-3 bg-background border rounded-lg"
						>
							<Input
								type="time"
								value={bt.startTime}
								className="h-9"
								onChange={(e) =>
									onUpdateBreakTime(i, "startTime", e.target.value)
								}
							/>
							<span className="text-muted-foreground">to</span>
							<Input
								type="time"
								value={bt.endTime}
								className="h-9"
								onChange={(e) =>
									onUpdateBreakTime(i, "endTime", e.target.value)
								}
							/>
							<Button
								variant="ghost"
								size="icon"
								className="text-rose-500 h-9 w-9 shrink-0"
								onClick={() => onRemoveBreakTime(i)}
							>
								<X className="h-4 w-4" />
							</Button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

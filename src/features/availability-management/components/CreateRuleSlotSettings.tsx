import FieldError from "@/components/common/Field-Error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { AvailabilityFormApi } from "./CreateRuleForm";

interface CreateRuleSlotSettingsProps {
	form: AvailabilityFormApi;
}

export function CreateRuleSlotSettings({ form }: CreateRuleSlotSettingsProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
			<form.Field name="slotDuration">
				{/* FIX: Type error */}
				{(field) => (
					<div className="space-y-3">
						<Label>Slot Duration (minutes)</Label>
						<RadioGroup
							value={String(field.state.value)}
							onValueChange={(val) =>
								field.handleChange(Number(val) as 30 | 60)
							}
							className="flex items-center gap-4"
						>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="30" id="r30" />
								<Label htmlFor="r30">30 min</Label>
							</div>
							<div className="flex items-center space-x-2">
								<RadioGroupItem value="60" id="r60" />
								<Label htmlFor="r60">60 min</Label>
							</div>
						</RadioGroup>
						<FieldError
							message={
								typeof field.state.meta.errors?.[0] === "string"
									? field.state.meta.errors[0]
									: field.state.meta.errors?.[0]
										? String(field.state.meta.errors[0])
										: undefined
							}
						/>
					</div>
				)}
			</form.Field>
			<form.Field name="bufferTime">
				{/* FIX: type error  */}
				{(field) => (
					<div className="space-y-2">
						<Label htmlFor={field.name}>Buffer Between Sessions (min)</Label>
						<Input
							id={field.name}
							type="number"
							min="5"
							max="60"
							step="5"
							value={field.state.value}
							onChange={(e) =>
								field.handleChange(
									e.target.value === "" ? "" : Number(e.target.value),
								)
							}
							onBlur={field.handleBlur}
						/>
						<FieldError
							message={
								typeof field.state.meta.errors?.[0] === "string"
									? field.state.meta.errors[0]
									: field.state.meta.errors?.[0]
										? String(field.state.meta.errors[0])
										: undefined
							}
						/>
					</div>
				)}
			</form.Field>
		</div>
	);
}

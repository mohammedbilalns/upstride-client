import { useForm } from "@tanstack/react-form";
import { useMemo } from "react";
import { Button } from "@/components/ui/Button";
import type { BreakTime, DayOfWeek } from "@/features/availability/types";
import {
	type AvailabilityFormValues,
	availabilityRuleSchema,
} from "@/features/availability/validators/rule.schema";
import {
	buildEmptyStringErrors,
	buildFieldErrorsFromIssues,
} from "@/shared/utils/formValidation";
import { CreateRuleBasicsFields } from "./BasicsFields";
import { CreateRuleBreakTimes } from "./BreakTimes";
import { CreateRuleDaysSelector } from "./DaysSelector";
import { CreateRuleScheduleFields } from "./ScheduleFields";
import { CreateRuleSlotSettings } from "./SlotSettings";

export type AvailabilityFormApi = ReturnType<
	//FIX: type error
	typeof useForm<AvailabilityFormValues>
>;

const DAYS: DayOfWeek[] = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
];

interface CreateRuleFormProps {
	defaultValues: AvailabilityFormValues;
	onSubmit: (data: AvailabilityFormValues) => void;
	isPending: boolean;
	submitLabel?: string;
	onCancel?: () => void;
}

export function CreateRuleForm({
	defaultValues,
	onSubmit,
	isPending,
	submitLabel = "Submit Rule Configuration",
	onCancel,
}: CreateRuleFormProps) {
	const todayDate = useMemo(() => {
		const date = new Date();
		date.setHours(0, 0, 0, 0);
		return date;
	}, []);

	const validateForm = (value: AvailabilityFormValues) => {
		const emptyErrors = buildEmptyStringErrors(value);
		if (Object.keys(emptyErrors).length > 0) {
			return { fields: emptyErrors };
		}
		if (value.bufferTime === "") {
			return { fields: { bufferTime: "Buffer time is required" } };
		}

		const parsed = availabilityRuleSchema.safeParse({
			...value,
			bufferTime: value.bufferTime,
		});
		return parsed.success
			? undefined
			: { fields: buildFieldErrorsFromIssues(parsed.error.issues) };
	};

	//FIX : pass validator to the tansack form here
	const form = useForm({
		defaultValues,
		validators: {
			onSubmit: ({ value }) => validateForm(value),
		},
		onSubmit: async ({ value }) => {
			if (value.bufferTime === "") return;
			const parsed = availabilityRuleSchema.safeParse({
				...value,
				bufferTime: value.bufferTime,
			});
			if (!parsed.success) return;
			onSubmit(parsed.data);
		},
	});

	const toggleDay = (day: DayOfWeek) => {
		const currentDays = form.state.values.days;
		const nextDays = currentDays.includes(day)
			? currentDays.filter((d) => d !== day)
			: [...currentDays, day];
		form.setFieldValue("days", nextDays);
	};

	const addBreakTime = () => {
		const current = form.state.values.breakTimes ?? [];
		if (current.length >= 5) return;
		const last = current[current.length - 1];
		const nextStartHour = last
			? Math.min(parseInt(last.endTime.split(":")[0] || "0", 10) + 1, 23)
			: 12;
		const nextStart = `${String(nextStartHour).padStart(2, "0")}:${
			last ? last.endTime.split(":")[1] || "00" : "00"
		}`;
		const nextEndHour = Math.min(nextStartHour + 1, 23);
		const nextEnd = `${String(nextEndHour).padStart(2, "0")}:${
			last ? last.endTime.split(":")[1] || "00" : "00"
		}`;
		form.setFieldValue("breakTimes", [
			...current,
			{ startTime: nextStart, endTime: nextEnd },
		]);
	};

	const updateBreakTime = (
		index: number,
		field: keyof BreakTime,
		value: string,
	) => {
		const bt = [...(form.state.values.breakTimes || [])];
		bt[index] = { ...bt[index], [field]: value };
		form.setFieldValue("breakTimes", bt);
	};

	const removeBreakTime = (index: number) => {
		const next = (form.state.values.breakTimes || []).filter(
			(_, i) => i !== index,
		);
		form.setFieldValue("breakTimes", next);
	};

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="flex flex-col gap-6"
		>
			<CreateRuleBasicsFields form={form} />

			<CreateRuleScheduleFields form={form} todayDate={todayDate} />

			<CreateRuleDaysSelector form={form} days={DAYS} onToggleDay={toggleDay} />

			<CreateRuleBreakTimes
				form={form}
				onAddBreakTime={addBreakTime}
				onUpdateBreakTime={updateBreakTime}
				onRemoveBreakTime={removeBreakTime}
			/>

			<CreateRuleSlotSettings form={form} />

			<form.Subscribe
				selector={(state) => [state.canSubmit, state.isSubmitting]}
			>
				{([canSubmit, isSubmitting]) => (
					<div className="mt-6 flex flex-col md:flex-row gap-3">
						<Button
							type="submit"
							className="h-11 px-8 w-full md:w-auto"
							disabled={!canSubmit || isSubmitting || isPending}
						>
							{submitLabel}
						</Button>
						{onCancel && (
							<Button
								type="button"
								variant="outline"
								className="h-11 px-8 w-full md:w-auto"
								onClick={onCancel}
								disabled={isSubmitting || isPending}
							>
								Cancel
							</Button>
						)}
					</div>
				)}
			</form.Subscribe>
		</form>
	);
}

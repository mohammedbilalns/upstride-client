import { useForm } from "@tanstack/react-form";
import { useMemo } from "react";
import type {
	BreakTime,
	DayOfWeek,
} from "@/features/availability-management/types";
import {
	type AvailabilityFormValues,
	availabilityRuleSchema,
} from "@/features/availability-management/validators/rule.schema";
import {
	buildEmptyStringErrors,
	buildFieldErrorsFromIssues,
} from "@/shared/utils/form-validation";
import { CreateRuleBasicsFields } from "./CreateRuleBasicsFields";
import { CreateRuleScheduleFields } from "./CreateRuleScheduleFields";
import { CreateRuleDaysSelector } from "./CreateRuleDaysSelector";
import { CreateRuleBreakTimes } from "./CreateRuleBreakTimes";
import { CreateRuleSlotSettings } from "./CreateRuleSlotSettings";
import { Button } from "@/components/ui/button";

export type AvailabilityFormApi = ReturnType<
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
	onSubmit: (data: any) => void;
	isPending: boolean;
}

export function CreateRuleForm({
	defaultValues,
	onSubmit,
	isPending,
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

	const form = useForm({
		defaultValues,
		validators: {
			onBlur: ({ value }) => validateForm(value),
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
		form.setFieldValue("breakTimes", [
			...current,
			{ startTime: "12:00", endTime: "13:00" },
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
			className="space-y-6"
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
				children={([canSubmit, isSubmitting]) => (
					<Button
						type="submit"
						className="mt-6 h-11 px-8 w-full md:w-auto"
						disabled={!canSubmit || isSubmitting || isPending}
					>
						Submit Rule Configuration
					</Button>
				)}
			/>
		</form>
	);
}

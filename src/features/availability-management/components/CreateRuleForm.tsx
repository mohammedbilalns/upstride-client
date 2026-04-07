import { useForm } from "@tanstack/react-form";
import { format, parseISO } from "date-fns";
import { useMemo } from "react";
import FieldError from "@/components/common/Field-Error";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar as CalendarIcon, Plus, X } from "lucide-react";
import {
	buildEmptyStringErrors,
	buildFieldErrorsFromIssues,
} from "@/shared/utils/form-validation";
import { cn } from "@/shared/utils/cn";
import { DayOfWeek, BreakTime } from "@/features/availability-management/types";
import {
	availabilityRuleSchema,
	type AvailabilityFormValues,
} from "@/features/availability-management/validators/rule.schema";

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
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<form.Field name="name">
					{(field) => (
						<div className="space-y-2">
							<Label htmlFor={field.name}>Rule Name</Label>
							<Input
								id={field.name}
								placeholder="e.g. Fall Semester Morning Slots"
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								onBlur={field.handleBlur}
							/>
							<FieldError message={field.state.meta.errors?.[0] as any} />
						</div>
					)}
				</form.Field>
				<form.Field name="description">
					{(field) => (
						<div className="space-y-2">
							<Label htmlFor={field.name}>Description</Label>
							<Input
								id={field.name}
								placeholder="What is this rule for?"
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								onBlur={field.handleBlur}
							/>
							<FieldError message={field.state.meta.errors?.[0] as any} />
						</div>
					)}
				</form.Field>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
				<form.Field name="startDate">
					{(field) => (
						<div className="space-y-2">
							<Label htmlFor={field.name}>Start Date</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										id={field.name}
										variant="outline"
										className="w-full justify-start text-left font-normal"
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{field.state.value
											? format(parseISO(field.state.value), "PPP")
											: "Pick a date"}
									</Button>
								</PopoverTrigger>
								<PopoverContent align="start" className="p-0">
									<Calendar
										mode="single"
										selected={
											field.state.value
												? parseISO(field.state.value)
												: undefined
										}
										onSelect={(date) => {
											if (!date) return;
											field.handleChange(format(date, "yyyy-MM-dd"));
											field.handleBlur();
										}}
										disabled={(date) => date < todayDate}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
							<FieldError message={field.state.meta.errors?.[0] as any} />
						</div>
					)}
				</form.Field>
				<form.Field name="endDate">
					{(field) => (
						<div className="space-y-2">
							<Label htmlFor={field.name}>End Date</Label>
							<Popover>
								<PopoverTrigger asChild>
									<Button
										id={field.name}
										variant="outline"
										className="w-full justify-start text-left font-normal"
									>
										<CalendarIcon className="mr-2 h-4 w-4" />
										{field.state.value
											? format(parseISO(field.state.value), "PPP")
											: "Pick a date"}
									</Button>
								</PopoverTrigger>
								<PopoverContent align="start" className="p-0">
									<Calendar
										mode="single"
										selected={
											field.state.value
												? parseISO(field.state.value)
												: undefined
										}
										onSelect={(date) => {
											if (!date) return;
											field.handleChange(format(date, "yyyy-MM-dd"));
											field.handleBlur();
										}}
										disabled={(date) => {
											const startDate = form.state.values.startDate;
											if (!startDate) return date < todayDate;
											return date < parseISO(startDate);
										}}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
							<FieldError message={field.state.meta.errors?.[0] as any} />
						</div>
					)}
				</form.Field>
				<form.Field name="startTime">
					{(field) => (
						<div className="space-y-2">
							<Label htmlFor={field.name}>Daily Start Time</Label>
							<Input
								id={field.name}
								type="time"
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								onBlur={field.handleBlur}
							/>
							<FieldError message={field.state.meta.errors?.[0] as any} />
						</div>
					)}
				</form.Field>
				<form.Field name="endTime">
					{(field) => (
						<div className="space-y-2">
							<Label htmlFor={field.name}>Daily End Time</Label>
							<Input
								id={field.name}
								type="time"
								value={field.state.value}
								onChange={(e) => field.handleChange(e.target.value)}
								onBlur={field.handleBlur}
							/>
							<FieldError message={field.state.meta.errors?.[0] as any} />
						</div>
					)}
				</form.Field>
			</div>

			<form.Field name="days">
				{(field) => (
					<div className="space-y-3">
						<Label>Active Days</Label>
						<div className="flex flex-wrap gap-3">
							{DAYS.map((day) => {
								const selected = form.state.values.days.includes(day);
								return (
									<button
										type="button"
										key={day}
										onClick={() => toggleDay(day)}
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
						<FieldError message={field.state.meta.errors?.[0] as any} />
					</div>
				)}
			</form.Field>

			<div className="space-y-3 p-4 border rounded-xl bg-muted/10">
				<div className="flex items-center justify-between">
					<Label className="text-base font-semibold">Break Times</Label>
					<Button variant="outline" size="sm" onClick={addBreakTime}>
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
										updateBreakTime(i, "startTime", e.target.value)
									}
								/>
								<span className="text-muted-foreground">to</span>
								<Input
									type="time"
									value={bt.endTime}
									className="h-9"
									onChange={(e) =>
										updateBreakTime(i, "endTime", e.target.value)
									}
								/>
								<Button
									variant="ghost"
									size="icon"
									className="text-rose-500 h-9 w-9 shrink-0"
									onClick={() => removeBreakTime(i)}
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						))}
					</div>
				)}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
				<form.Field name="slotDuration">
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
							<FieldError message={field.state.meta.errors?.[0] as any} />
						</div>
					)}
				</form.Field>
				<form.Field name="bufferTime">
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
							<FieldError message={field.state.meta.errors?.[0] as any} />
						</div>
					)}
				</form.Field>
			</div>

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

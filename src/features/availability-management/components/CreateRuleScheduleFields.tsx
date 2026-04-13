import { format, parseISO } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
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
import type { AvailabilityFormApi } from "./CreateRuleForm";

interface CreateRuleScheduleFieldsProps {
	form: AvailabilityFormApi;
	todayDate: Date;
}

export function CreateRuleScheduleFields({
	form,
	todayDate,
}: CreateRuleScheduleFieldsProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
			<form.Field name="startDate">
				{/* FIX: type error  */}
				{(field) => (
					<div className="space-y-2">
						<Label htmlFor={field.name}>Start Date</Label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									id={field.name}
									type="button"
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
										field.state.value ? parseISO(field.state.value) : undefined
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
			<form.Field name="endDate">
				{(field) => (
					<div className="space-y-2">
						<Label htmlFor={field.name}>End Date</Label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									id={field.name}
									type="button"
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
										field.state.value ? parseISO(field.state.value) : undefined
									}
									onSelect={(date) => {
										if (!date) return;
										field.handleChange(format(date, "yyyy-MM-dd"));
										field.handleBlur();
									}}
									disabled={(date) => {
										const startDate = form.state.values.startDate;
										if (!startDate) return date < todayDate;
										const start = parseISO(startDate);
										const maxEnd = new Date(start);
										maxEnd.setDate(maxEnd.getDate() + 30);
										return date < start || date > maxEnd;
									}}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
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
			<form.Field name="endTime">
				{/* FIX: type error */}
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

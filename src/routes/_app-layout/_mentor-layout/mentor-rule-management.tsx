import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import FieldError from "@/components/common/Field-Error";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { availabilityManagementService } from "@/features/availability-management/services/availability-management.service";
import { useProfile } from "@/features/profile-management/hooks/use-profile";
import { Clock, Calendar, Power, Plus, X } from "lucide-react";
import type {
	DayOfWeek,
	BreakTime,
	CreateAvailabilityInput,
	AvailabilityRule,
	ConflictAvailabilitySummary,
} from "@/features/availability-management/types";
import {
	buildEmptyStringErrors,
	buildFieldErrorsFromIssues,
} from "@/shared/utils/form-validation";
import { cn } from "@/shared/utils/cn";

export const Route = createFileRoute(
	"/_app-layout/_mentor-layout/mentor-rule-management",
)({
	component: MentorRuleManagement,
});

const DAYS: DayOfWeek[] = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
];

const DaySchema = z.enum([
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
]);

const availabilityRuleSchema = z
	.object({
		name: z
			.string()
			.trim()
			.min(2, "Name must be at least 2 characters")
			.max(100, "Name must be at most 100 characters"),
		description: z
			.string()
			.trim()
			.min(10, "Description must be at least 10 characters")
			.max(1000, "Description must be at most 1000 characters"),
		days: z.array(DaySchema).min(1, "At least one day is required"),
		startTime: z
			.string()
			.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Must be HH:MM"),
		endTime: z
			.string()
			.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Must be HH:MM"),
		startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD"),
		endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD"),
		breakTimes: z
			.array(
				z.object({
					startTime: z
						.string()
						.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Must be HH:MM"),
					endTime: z
						.string()
						.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Must be HH:MM"),
				}),
			)
			.default([]),
		slotDuration: z.union([z.literal(30), z.literal(60)]),
		bufferTime: z
			.number()
			.int()
			.min(5, "Buffer time must be between 5 and 60 minutes")
			.max(60, "Buffer time must be between 5 and 60 minutes"),
	})
	.superRefine((value, ctx) => {
		const [startH, startM] = value.startTime.split(":").map(Number);
		const [endH, endM] = value.endTime.split(":").map(Number);
		const start = startH * 60 + startM;
		const end = endH * 60 + endM;
		if (end <= start) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "End time must be after start time",
				path: ["endTime"],
			});
			return;
		}
		if (end - start < 60) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "Availability must be at least 1 hour",
				path: ["endTime"],
			});
		}
	});

type AvailabilityFormValues = Omit<
	z.infer<typeof availabilityRuleSchema>,
	"bufferTime"
> & {
	bufferTime: number | "";
};

const formatDateShort = (dateStr: string) => {
	const [year, month, day] = dateStr.split("-");
	if (!year || !month || !day) return dateStr;
	return `${day}/${month}/${year.slice(-2)}`;
};

function MentorRuleManagement() {
	const { data: profile } = useProfile();
	const queryClient = useQueryClient();
	const [availabilityFilter, setAvailabilityFilter] = useState<
		"active" | "expired"
	>("active");
	const [statusFilter, setStatusFilter] = useState<"all" | "disabled">("all");
	const [page, setPage] = useState(1);
	const limit = 5;
	const [rules, setRules] = useState<AvailabilityRule[]>([]);
	const today = new Date().toISOString().split("T")[0];
	const defaultValues: AvailabilityFormValues = {
		name: "",
		description: "",
		days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
		startTime: "09:00",
		endTime: "17:00",
		startDate: today,
		endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
			.toISOString()
			.split("T")[0],
		breakTimes: [{ startTime: "12:00", endTime: "13:00" }],
		slotDuration: 30,
		bufferTime: 15,
	};

	const [confirmAction, setConfirmAction] = useState<{
		type: "enable" | "delete" | "add" | "conflict" | "enable-conflict";
		ruleId?: string;
	} | null>(null);
	const [pendingRule, setPendingRule] =
		useState<CreateAvailabilityInput | null>(null);
	const [conflictSummaries, setConflictSummaries] = useState<
		ConflictAvailabilitySummary[]
	>([]);

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
			setPendingRule(parsed.data);
			setConfirmAction({ type: "add" });
		},
	});

	const { data, isLoading, isFetching } = useQuery({
		queryKey: [
			"mentor-availabilities",
			profile?.id,
			availabilityFilter,
			statusFilter,
			page,
		],
		queryFn: () =>
			availabilityManagementService.getMentorAvailabilities({
				mentorId: profile?.id || "",
				expiredOnly: availabilityFilter === "expired",
				includeExpired: availabilityFilter !== "expired" ? false : undefined,
				status: statusFilter === "disabled" ? "disabled" : undefined,
				page,
				limit,
			}),
		enabled: !!profile?.id,
	});

	const pagination = data?.pagination;
	const hasMore =
		pagination !== undefined
			? pagination.page < pagination.totalPages
			: (data?.data?.availabilities?.length ?? 0) === limit;

	useEffect(() => {
		if (!data?.data?.availabilities) return;
		setRules((prev) => {
			if (page === 1) return data.data.availabilities;
			const existingIds = new Set(prev.map((r) => r.id));
			const merged = [...prev];
			for (const rule of data.data.availabilities) {
				if (!existingIds.has(rule.id)) merged.push(rule);
			}
			return merged;
		});
	}, [data, page]);

	const addMutation = useMutation({
		mutationFn: (data: CreateAvailabilityInput) =>
			availabilityManagementService.checkAndCreateAvailability(data),
		onSuccess: (response) => {
			if (response.data.created) {
				toast.success("Availability rule added");
				queryClient.invalidateQueries({ queryKey: ["mentor-availabilities"] });
				form.reset();
				setPendingRule(null);
				setPage(1);
				setRules([]);
				return;
			}

			setConflictSummaries(response.data.conflicts ?? []);
			setConfirmAction({ type: "conflict" });
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Failed to add rule");
		},
	});
	const forceCreateMutation = useMutation({
		mutationFn: (data: CreateAvailabilityInput) =>
			availabilityManagementService.createAvailability(data),
		onSuccess: () => {
			toast.success("Availability rule added");
			queryClient.invalidateQueries({ queryKey: ["mentor-availabilities"] });
			form.reset();
			setPendingRule(null);
			setConflictSummaries([]);
			setPage(1);
			setRules([]);
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Failed to add rule");
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) =>
			availabilityManagementService.deleteAvailability(id),
		onSuccess: () => {
			toast.success("Rule disabled/deleted");
			queryClient.invalidateQueries({ queryKey: ["mentor-availabilities"] });
			setPage(1);
			setRules([]);
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Failed to disable rule");
		},
	});

	const enableMutation = useMutation({
		mutationFn: (id: string) =>
			availabilityManagementService.reenableAvailability(id),
		onSuccess: () => {
			toast.success("Rule re-enabled");
			queryClient.invalidateQueries({ queryKey: ["mentor-availabilities"] });
			setConfirmAction(null);
			setConflictSummaries([]);
			setPage(1);
			setRules([]);
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Failed to enable rule");
		},
	});
	const checkEnableMutation = useMutation({
		mutationFn: (id: string) =>
			availabilityManagementService.checkAndReenableAvailability(id),
		onSuccess: (response, ruleId) => {
			if (response.data.enabled) {
				toast.success("Rule re-enabled");
				queryClient.invalidateQueries({ queryKey: ["mentor-availabilities"] });
				setPage(1);
				setRules([]);
				return;
			}
			setConflictSummaries(response.data.conflicts ?? []);
			setConfirmAction({ type: "enable-conflict", ruleId });
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Failed to enable rule");
		},
	});

	const confirmAndRun = () => {
		if (!confirmAction) return;
		if (confirmAction.type === "add" && pendingRule)
			addMutation.mutate(pendingRule);
		if (confirmAction.type === "conflict" && pendingRule)
			forceCreateMutation.mutate(pendingRule);
		if (confirmAction.type === "enable-conflict" && confirmAction.ruleId)
			enableMutation.mutate(confirmAction.ruleId);
		if (confirmAction.type === "delete" && confirmAction.ruleId)
			deleteMutation.mutate(confirmAction.ruleId);
		if (confirmAction.type === "enable" && confirmAction.ruleId) {
			checkEnableMutation.mutate(confirmAction.ruleId);
		}
		setConfirmAction(null);
	};

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
		<div className="p-4 md:p-8 space-y-8 max-w-5xl mx-auto">
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold tracking-tight">
					Availability Rules
				</h1>
				<p className="text-muted-foreground">
					Define your recurring weekly availability. The system will
					automatically compute accurate booking slots based on these configured
					rules, break times, and session durations.
				</p>
			</div>

			<Card className="border-border/60 shadow-sm overflow-hidden">
				<CardHeader className="bg-muted/30">
					<CardTitle className="text-lg flex items-center gap-2">
						<Plus className="h-5 w-5 text-primary" />
						Create New Rule
					</CardTitle>
				</CardHeader>
				<CardContent className="p-6 space-y-6">
					<form
						onSubmit={(e) => {
							e.preventDefault();
							e.stopPropagation();
							form.handleSubmit();
						}}
						className="space-y-6"
					>
						{/* Basic Info */}
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

						{/* Date Range & Time */}
						<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
							<form.Field name="startDate">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name}>Start Date</Label>
										<Input
											id={field.name}
											type="date"
											value={field.state.value}
											min={today}
											onChange={(e) => field.handleChange(e.target.value)}
											onBlur={field.handleBlur}
										/>
										<FieldError message={field.state.meta.errors?.[0] as any} />
									</div>
								)}
							</form.Field>
							<form.Field name="endDate">
								{(field) => (
									<div className="space-y-2">
										<Label htmlFor={field.name}>End Date</Label>
										<Input
											id={field.name}
											type="date"
											value={field.state.value}
											min={form.state.values.startDate || today}
											onChange={(e) => field.handleChange(e.target.value)}
											onBlur={field.handleBlur}
										/>
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

						{/* Days of Week */}
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

						{/* Break Times */}
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

						{/* Slot Config */}
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
										<Label htmlFor={field.name}>
											Buffer Between Sessions (min)
										</Label>
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
									disabled={!canSubmit || isSubmitting || addMutation.isPending}
								>
									Submit Rule Configuration
								</Button>
							)}
						/>
					</form>
				</CardContent>
			</Card>

			<div className="space-y-4">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
					<h2 className="text-xl font-semibold flex items-center gap-2">
						<Calendar className="h-5 w-5" />
						Current Rules
					</h2>
					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant={
								availabilityFilter === "active" && statusFilter !== "disabled"
									? "default"
									: "outline"
							}
							size="sm"
							onClick={() => {
								setAvailabilityFilter("active");
								setStatusFilter("all");
								setPage(1);
								setRules([]);
							}}
						>
							Active
						</Button>
						<Button
							type="button"
							variant={availabilityFilter === "expired" ? "default" : "outline"}
							size="sm"
							onClick={() => {
								setAvailabilityFilter("expired");
								setStatusFilter("all");
								setPage(1);
								setRules([]);
							}}
						>
							Expired
						</Button>
						<Button
							type="button"
							variant={statusFilter === "disabled" ? "default" : "outline"}
							size="sm"
							onClick={() => {
								setAvailabilityFilter("active");
								setStatusFilter((prev) =>
									prev === "disabled" ? "all" : "disabled",
								);
								setPage(1);
								setRules([]);
							}}
						>
							Disabled Only
						</Button>
					</div>
				</div>
				{isLoading ? (
					<div className="p-8 text-center text-muted-foreground animate-pulse">
						Loading rules...
					</div>
				) : rules.length === 0 ? (
					<Card className="border-dashed border-2 flex flex-col items-center justify-center p-12 text-center">
						<Clock className="h-12 w-12 text-muted-foreground/30 mb-4" />
						<p className="text-muted-foreground font-medium">
							No availability rules defined yet.
						</p>
						<p className="text-sm text-muted-foreground">
							Add a rule above to start receiving bookings.
						</p>
					</Card>
				) : (
					<div className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{rules.map((rule) => {
								const active = rule.status;
								return (
									<Card
										key={rule.id}
										className={cn(
											"border-border/60 shadow-sm transition-all flex flex-col hover:shadow-md",
											!active && "opacity-60 bg-muted/20 border-dashed",
										)}
									>
										<CardHeader className="pb-3 border-b bg-muted/10">
											<div className="flex justify-between items-start">
												<div>
													<CardTitle className="text-base line-clamp-1">
														{rule.name}
													</CardTitle>
													<p className="text-xs text-muted-foreground mt-1 line-clamp-2 min-h-[32px]">
														{rule.description || "No description provided."}
													</p>
												</div>
												<Badge
													variant={active ? "default" : "secondary"}
													className="shrink-0 ml-2"
												>
													{active ? "Active" : "Disabled"}
												</Badge>
											</div>
										</CardHeader>
										<CardContent className="p-4 flex-1 space-y-4 text-sm">
											<div className="space-y-1.5 border-b pb-3">
												<div className="flex justify-between">
													<span className="text-muted-foreground">
														Valid Period:
													</span>
													<span className="font-medium text-right">
														{formatDateShort(rule.startDate)} to{" "}
														{formatDateShort(rule.endDate)}
													</span>
												</div>
												<div className="flex justify-between">
													<span className="text-muted-foreground">
														Daily Window:
													</span>
													<span className="font-medium">
														{rule.startTime} - {rule.endTime}
													</span>
												</div>
												<div className="flex justify-between">
													<span className="text-muted-foreground">
														Session / Buffer:
													</span>
													<span className="font-medium">
														{rule.slotDuration}m / {rule.bufferTime}m
													</span>
												</div>
											</div>

											<div>
												<span className="text-muted-foreground block mb-2 text-xs uppercase tracking-wider font-semibold">
													Active Days
												</span>
												<div className="flex flex-wrap gap-1">
													{rule.days.map((d) => (
														<Badge
															key={d}
															variant="outline"
															className="bg-background text-xs font-normal px-2 py-0.5"
														>
															{d.substring(0, 3)}
														</Badge>
													))}
												</div>
											</div>

											{rule.breakTimes && rule.breakTimes.length > 0 && (
												<div>
													<span className="text-muted-foreground block mb-2 text-xs uppercase tracking-wider font-semibold">
														Break Times
													</span>
													<div className="space-y-1">
														{rule.breakTimes.map((bt, i) => (
															<div
																key={i}
																className="text-xs flex items-center gap-1.5"
															>
																<Clock className="w-3 h-3" /> {bt.startTime} -{" "}
																{bt.endTime}
															</div>
														))}
													</div>
												</div>
											)}
										</CardContent>
										<div className="p-3 border-t bg-muted/5 flex justify-end gap-2 shrink-0">
											{active ? (
												<Button
													variant="ghost"
													size="sm"
													className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 w-full justify-center"
													onClick={() =>
														setConfirmAction({
															type: "delete",
															ruleId: rule.id,
														})
													}
												>
													<Power className="h-4 w-4 mr-2" /> Disable Rule
												</Button>
											) : (
												<Button
													variant="ghost"
													size="sm"
													className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 w-full justify-center"
													onClick={() =>
														setConfirmAction({
															type: "enable",
															ruleId: rule.id,
														})
													}
												>
													<Power className="h-4 w-4 mr-2" /> Enable Rule
												</Button>
											)}
										</div>
									</Card>
								);
							})}
						</div>
						{hasMore && (
							<div className="flex justify-center">
								<Button
									type="button"
									variant="outline"
									disabled={isFetching}
									onClick={() => setPage((prev) => prev + 1)}
								>
									{isFetching ? "Loading..." : "View more"}
								</Button>
							</div>
						)}
					</div>
				)}
			</div>

			<ConfirmModal
				isOpen={Boolean(confirmAction)}
				onClose={() => setConfirmAction(null)}
				onConfirm={confirmAndRun}
				title={
					confirmAction?.type === "add"
						? "Confirm New Rule"
						: confirmAction?.type === "conflict"
							? "Availability Conflict"
							: confirmAction?.type === "enable-conflict"
								? "Availability Conflict"
								: confirmAction?.type === "delete"
									? "Disable Rule"
									: "Re-enable Rule"
				}
				message={
					confirmAction?.type === "add"
						? "This will create a new availability rule for mentees to book sessions."
						: confirmAction?.type === "conflict"
							? `There is a conflict with: ${conflictSummaries
									.map(
										(c) =>
											`${c.name} (${formatDateShort(
												c.startDate,
											)} to ${formatDateShort(c.endDate)}, ${
												c.startTime
											}-${c.endTime})`,
									)
									.join(
										"; ",
									)}. Would you want to continue? The new rule will have the higher priority over the old one.`
							: confirmAction?.type === "enable-conflict"
								? `There is a conflict with: ${conflictSummaries
										.map(
											(c) =>
												`${c.name} (${formatDateShort(
													c.startDate,
												)} to ${formatDateShort(c.endDate)}, ${
													c.startTime
												}-${c.endTime})`,
										)
										.join(
											"; ",
										)}. Would you want to continue? The new rule will have the higher priority over the old one.`
								: confirmAction?.type === "delete"
									? "Are you sure you want to disable this availability rule? Mentees won't be able to book these slots while disabled."
									: "Bring this rule back into active rotation?"
				}
				variant={confirmAction?.type === "delete" ? "destructive" : "default"}
				isLoading={
					addMutation.isPending ||
					forceCreateMutation.isPending ||
					deleteMutation.isPending ||
					enableMutation.isPending ||
					checkEnableMutation.isPending
				}
				confirmText="Confirm"
			/>
		</div>
	);
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar as CalendarIcon, Clock, Plus, Power } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateRuleForm } from "@/features/availability-management/components/CreateRuleForm";
import { availabilityManagementService } from "@/features/availability-management/services/availability-management.service";
import type {
	AvailabilityRule,
	ConflictAvailabilitySummary,
	CreateAvailabilityInput,
} from "@/features/availability-management/types";
import type { AvailabilityFormValues } from "@/features/availability-management/validators/rule.schema";
import { useProfile } from "@/features/profile-management/hooks/use-profile";
import { cn } from "@/shared/utils/cn";
import { formatDateDmyShort } from "@/shared/utils/date";

export function MentorRuleManagementPage() {
	const { data: profile } = useProfile();
	const queryClient = useQueryClient();
	const [availabilityFilter, setAvailabilityFilter] = useState<
		"active" | "expired"
	>("active");
	const [statusFilter, setStatusFilter] = useState<"all" | "disabled">("all");
	const [page, setPage] = useState(1);
	const limit = 5;
	const [rules, setRules] = useState<AvailabilityRule[]>([]);
	const [formKey, setFormKey] = useState(0);
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
	const todayDate = useMemo(() => {
		const date = new Date();
		date.setHours(0, 0, 0, 0);
		return date;
	}, []);

	const handleRuleSubmit = (parsedData: any) => {
		setPendingRule(parsedData);
		setConfirmAction({ type: "add" });
	};

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
				setFormKey((prev) => prev + 1);
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
			setFormKey((prev) => prev + 1);
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
					<CreateRuleForm
						key={formKey}
						defaultValues={defaultValues}
						onSubmit={handleRuleSubmit}
						isPending={addMutation.isPending}
					/>
				</CardContent>
			</Card>

			<div className="space-y-4">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
					<h2 className="text-xl font-semibold flex items-center gap-2">
						<CalendarIcon className="h-5 w-5" />
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
														{formatDateDmyShort(rule.startDate)} to{" "}
														{formatDateDmyShort(rule.endDate)}
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
											`${c.name} (${formatDateDmyShort(
												c.startDate,
											)} to ${formatDateDmyShort(c.endDate)}, ${
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
												`${c.name} (${formatDateDmyShort(
													c.startDate,
												)} to ${formatDateDmyShort(c.endDate)}, ${
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

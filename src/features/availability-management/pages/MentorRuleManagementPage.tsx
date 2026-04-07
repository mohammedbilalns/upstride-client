import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { RuleManagementHeader } from "@/features/availability-management/components/RuleManagementHeader";
import { RuleCreationCard } from "@/features/availability-management/components/RuleCreationCard";
import { AvailabilityRulesSection } from "@/features/availability-management/components/AvailabilityRulesSection";
import { availabilityManagementService } from "@/features/availability-management/services/availability-management.service";
import type {
	AvailabilityRule,
	ConflictAvailabilitySummary,
	CreateAvailabilityInput,
} from "@/features/availability-management/types";
import type { AvailabilityFormValues } from "@/features/availability-management/validators/rule.schema";
import { useProfile } from "@/features/profile-management/hooks/use-profile";
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

	const handleRuleSubmit = (parsedData: unknown) => {
		setPendingRule(parsedData as CreateAvailabilityInput);
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
			<RuleManagementHeader />

			<RuleCreationCard
				defaultValues={defaultValues}
				onSubmit={handleRuleSubmit}
				isPending={addMutation.isPending}
				formKey={formKey}
			/>

			<AvailabilityRulesSection
				availabilityFilter={availabilityFilter}
				statusFilter={statusFilter}
				onSetAvailabilityFilter={(value) => {
					setAvailabilityFilter(value);
					setStatusFilter("all");
					setPage(1);
					setRules([]);
				}}
				onToggleDisabledFilter={() => {
					setAvailabilityFilter("active");
					setStatusFilter((prev) => (prev === "disabled" ? "all" : "disabled"));
					setPage(1);
					setRules([]);
				}}
				rules={rules}
				isLoading={isLoading}
				isFetching={isFetching}
				hasMore={hasMore}
				onLoadMore={() => setPage((prev) => prev + 1)}
				onDisableRule={(ruleId) =>
					setConfirmAction({
						type: "delete",
						ruleId,
					})
				}
				onEnableRule={(ruleId) =>
					setConfirmAction({
						type: "enable",
						ruleId,
					})
				}
			/>

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

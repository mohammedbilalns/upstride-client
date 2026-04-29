import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ApiError } from "@/api/apiError";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { AvailabilityRulesSection } from "@/features/availability/components/AvailabilityRulesSection";
import { RuleCreationCard } from "@/features/availability/components/RuleCreationCard";
import { RuleManagementHeader } from "@/features/availability/components/RuleManagementHeader";
import { availabilityManagementService } from "@/features/availability/services/availability.service";
import type {
	AvailabilityRule,
	CreateAvailabilityInput,
	MentorAvailabilitiesResponse,
} from "@/features/availability/types";
import type { AvailabilityFormValues } from "@/features/availability/validators/rule.schema";
import { useProfile } from "@/features/profile/hooks/queries/useProfile";

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
		endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
			.toISOString()
			.split("T")[0],
		breakTimes: [{ startTime: "12:00", endTime: "13:00" }],
		slotDuration: 30,
		bufferTime: 15,
	};

	const [confirmAction, setConfirmAction] = useState<{
		type: "enable" | "delete" | "add";
		ruleId?: string;
	} | null>(null);
	const [pendingRule, setPendingRule] =
		useState<CreateAvailabilityInput | null>(null);
	const updateAvailabilityCache = (
		updater: (items: AvailabilityRule[]) => AvailabilityRule[],
	) => {
		queryClient.setQueriesData(
			{ queryKey: ["mentor-availabilities"] },
			(old) => {
				if (!old) return old;
				const typed = old as MentorAvailabilitiesResponse;
				const availabilities = typed.data?.availabilities ?? [];
				return {
					...typed,
					data: {
						...typed.data,
						availabilities: updater(availabilities),
					},
				};
			},
		);
		setRules((prev) => updater(prev));
	};

	const snapshotAvailabilityCache = () =>
		queryClient.getQueriesData<MentorAvailabilitiesResponse>({
			queryKey: ["mentor-availabilities"],
		});

	const restoreAvailabilityCache = (
		snapshots: Array<[unknown, MentorAvailabilitiesResponse | undefined]>,
	) => {
		for (const [key, data] of snapshots) {
			queryClient.setQueryData(key, data);
		}
	};

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

	const pagination = data?.data?.pagination;
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
				const createdAvailability = response.data.availability;
				if (createdAvailability) {
					updateAvailabilityCache((items) => [createdAvailability, ...items]);
				}
				toast.success("Availability rule added");
				setFormKey((prev) => prev + 1);
				setPendingRule(null);
				setPage(1);
				setRules([]);
				return;
			}

			toast.error(
				"This rule overlaps with an existing active rule. Please adjust the schedule.",
			);
			setPendingRule(null);
		},
		onError: (error: ApiError) => {
			toast.error(error?.response?.data?.message || "Failed to add rule");
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) =>
			availabilityManagementService.deleteAvailability(id),
		onMutate: (id) => {
			const snapshots = snapshotAvailabilityCache();
			updateAvailabilityCache((items) =>
				items.map((item) =>
					item.id === id ? { ...item, status: false } : item,
				),
			);
			return { snapshots };
		},
		onSuccess: () => {
			toast.success("Rule disabled/deleted");
			setConfirmAction(null);
		},
		onError: (error: ApiError, _variables, context) => {
			if (context?.snapshots) restoreAvailabilityCache(context.snapshots);
			toast.error(error?.response?.data?.message || "Failed to disable rule");
		},
	});

	const enableMutation = useMutation({
		mutationFn: (id: string) =>
			availabilityManagementService.reenableAvailability(id),
		onMutate: (id) => {
			const snapshots = snapshotAvailabilityCache();
			updateAvailabilityCache((items) =>
				items.map((item) =>
					item.id === id ? { ...item, status: true } : item,
				),
			);
			return { snapshots };
		},
		onSuccess: () => {
			toast.success("Rule re-enabled");
			setConfirmAction(null);
		},
		onError: (error: ApiError, _variables, context) => {
			if (context?.snapshots) restoreAvailabilityCache(context.snapshots);
			toast.error(error?.response?.data?.message || "Failed to enable rule");
		},
	});
	const checkEnableMutation = useMutation({
		mutationFn: (id: string) =>
			availabilityManagementService.checkAndReenableAvailability(id),
		onSuccess: (response, ruleId) => {
			if (response.data.enabled) {
				updateAvailabilityCache((items) =>
					items.map((item) =>
						item.id === ruleId ? { ...item, status: true } : item,
					),
				);
				toast.success("Rule re-enabled");
				setConfirmAction(null);
				return;
			}
			toast.error(
				"This rule overlaps with an existing active rule. Disable the conflicting rule first.",
			);
			setConfirmAction(null);
		},
		onError: (error: ApiError) => {
			toast.error(error?.response?.data?.message || "Failed to enable rule");
		},
	});

	const confirmAndRun = () => {
		if (!confirmAction) return;
		if (confirmAction.type === "add" && pendingRule)
			addMutation.mutate(pendingRule);
		if (confirmAction.type === "delete" && confirmAction.ruleId)
			deleteMutation.mutate(confirmAction.ruleId);
		if (confirmAction.type === "enable" && confirmAction.ruleId) {
			checkEnableMutation.mutate(confirmAction.ruleId);
		}
		setConfirmAction(null);
	};

	return (
		<div className="mx-auto max-w-5xl space-y-8 p-3 sm:p-4 md:p-6 lg:p-8">
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
						: confirmAction?.type === "delete"
							? "Disable Rule"
							: "Re-enable Rule"
				}
				message={
					confirmAction?.type === "add"
						? "This will create a new availability rule for mentees to book sessions."
						: confirmAction?.type === "delete"
							? "Are you sure you want to disable this availability rule? Mentees won't be able to book these slots while disabled."
							: "Bring this rule back into active rotation?"
				}
				variant={confirmAction?.type === "delete" ? "destructive" : "default"}
				isLoading={
					addMutation.isPending ||
					deleteMutation.isPending ||
					enableMutation.isPending ||
					checkEnableMutation.isPending
				}
				confirmText="Confirm"
			/>
		</div>
	);
}

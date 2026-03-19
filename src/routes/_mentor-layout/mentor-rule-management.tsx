import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { recurringRuleService } from "@/features/recurring-rule-management";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { ConfirmModal } from "@/components/common/ConfirmModal";

export const Route = createFileRoute("/_mentor-layout/mentor-rule-management")({
	component: MentorRuleManagement,
});

function MentorRuleManagement() {
	const queryClient = useQueryClient();
	const [newRule, setNewRule] = useState({
		weekDay: "1",
		startTime: "09:00",
		endTime: "09:30",
		slotDuration: "30",
	});
	const [editingRuleId, setEditingRuleId] = useState<string | null>(null);
	const [confirmAction, setConfirmAction] = useState<{
		type: "enable" | "disable" | "delete" | "add";
		ruleId: string;
	} | null>(null);
	const [editRule, setEditRule] = useState({
		weekDay: "",
		startTime: "",
		endTime: "",
		slotDuration: "30",
	});

	const { data, isLoading } = useQuery({
		queryKey: ["recurring-rules"],
		queryFn: () => recurringRuleService.getRules(),
	});

	const rules = data?.data.rules ?? [];

	const ruleById = useMemo(() => {
		return new Map(rules.map((rule) => [rule.ruleId, rule]));
	}, [rules]);

	const toMinutes = (time: string) => {
		const [hours, minutes] = time.split(":").map(Number);
		if (Number.isNaN(hours) || Number.isNaN(minutes)) return 0;
		return hours * 60 + minutes;
	};

	const toTimeString = (minutes: number) => {
		const h = Math.floor(minutes / 60);
		const m = minutes % 60;
		return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
	};

	const clampMinutes = (value: number) => {
		if (value < 0) return 0;
		if (value > 24 * 60 - 1) return 24 * 60 - 1;
		return value;
	};

	const updateNewStart = (value: string) => {
		const start = toMinutes(value);
		const duration = Number(newRule.slotDuration);
		const end = clampMinutes(start + duration);
		setNewRule((prev) => ({
			...prev,
			startTime: value,
			endTime: toTimeString(end),
		}));
	};

	const updateNewEnd = (value: string) => {
		const end = toMinutes(value);
		const duration = Number(newRule.slotDuration);
		const start = clampMinutes(end - duration);
		setNewRule((prev) => ({
			...prev,
			endTime: value,
			startTime: toTimeString(start),
		}));
	};

	const updateNewDuration = (value: string) => {
		const start = toMinutes(newRule.startTime);
		const duration = Number(value);
		const end = clampMinutes(start + duration);
		setNewRule((prev) => ({
			...prev,
			slotDuration: value,
			endTime: toTimeString(end),
		}));
	};

	const updateEditStart = (value: string) => {
		const start = toMinutes(value);
		const duration = Number(editRule.slotDuration);
		const end = clampMinutes(start + duration);
		setEditRule((prev) => ({
			...prev,
			startTime: value,
			endTime: toTimeString(end),
		}));
	};

	const updateEditEnd = (value: string) => {
		const end = toMinutes(value);
		const duration = Number(editRule.slotDuration);
		const start = clampMinutes(end - duration);
		setEditRule((prev) => ({
			...prev,
			endTime: value,
			startTime: toTimeString(start),
		}));
	};

	const updateEditDuration = (value: string) => {
		const start = toMinutes(editRule.startTime);
		const duration = Number(value);
		const end = clampMinutes(start + duration);
		setEditRule((prev) => ({
			...prev,
			slotDuration: value,
			endTime: toTimeString(end),
		}));
	};

	const addMutation = useMutation({
		mutationFn: () =>
			recurringRuleService.addRule({
				rule: {
					weekDay: Number(newRule.weekDay),
					startTime: toMinutes(newRule.startTime),
					endTime: toMinutes(newRule.endTime),
					slotDuration: Number(newRule.slotDuration) as 30 | 60,
				},
			}),
		onSuccess: () => {
			toast.success("Rule added");
			queryClient.invalidateQueries({ queryKey: ["recurring-rules"] });
			setNewRule({
				weekDay: "1",
				startTime: "09:00",
				endTime: "09:30",
				slotDuration: "30",
			});
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Failed to add rule");
		},
	});

	const updateMutation = useMutation({
		mutationFn: () =>
			recurringRuleService.updateRule({
				ruleId: editingRuleId as string,
				updates: {
					weekDay: Number(editRule.weekDay),
					startTime: toMinutes(editRule.startTime),
					endTime: toMinutes(editRule.endTime),
					slotDuration: Number(editRule.slotDuration) as 30 | 60,
				},
			}),
		onSuccess: () => {
			toast.success("Rule updated");
			queryClient.invalidateQueries({ queryKey: ["recurring-rules"] });
			setEditingRuleId(null);
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Failed to update rule");
		},
	});

	const enableMutation = useMutation({
		mutationFn: (ruleId: string) => recurringRuleService.enableRule(ruleId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["recurring-rules"] });
		},
	});

	const disableMutation = useMutation({
		mutationFn: (ruleId: string) => recurringRuleService.disableRule(ruleId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["recurring-rules"] });
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (ruleId: string) => recurringRuleService.deleteRule({ ruleId }),
		onSuccess: () => {
			toast.success("Rule deleted");
			queryClient.invalidateQueries({ queryKey: ["recurring-rules"] });
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Failed to delete rule");
		},
	});

	const openEditDialog = (ruleId: string) => {
		const rule = ruleById.get(ruleId);
		if (!rule) return;
		setEditingRuleId(ruleId);
		setEditRule({
			weekDay: String(rule.weekDay),
			startTime: toTimeString(rule.startTime),
			endTime: toTimeString(rule.endTime),
			slotDuration: String(rule.slotDuration),
		});
	};

	const confirmAndRun = () => {
		if (!confirmAction) return;
		if (confirmAction.type === "add") {
			addMutation.mutate();
		}
		if (confirmAction.type === "enable") {
			enableMutation.mutate(confirmAction.ruleId);
		}
		if (confirmAction.type === "disable") {
			disableMutation.mutate(confirmAction.ruleId);
		}
		if (confirmAction.type === "delete") {
			deleteMutation.mutate(confirmAction.ruleId);
		}
		setConfirmAction(null);
	};

	return (
		<div className="p-8 space-y-6">
			<Card className="border-border/60 shadow-sm">
				<CardHeader>
					<CardTitle className="text-2xl">Rule Management</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						Configure weekly availability rules.
					</p>
					<p className="text-sm text-muted-foreground mt-2">
						Slots for the next week are generated automatically from active
						rules.
					</p>
				</CardContent>
			</Card>

			<Card className="border-border/60 shadow-sm">
				<CardHeader>
					<CardTitle className="text-xl">Add Rule</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
						<div className="space-y-2">
							<Label>Weekday</Label>
							<Select
								value={newRule.weekDay}
								onValueChange={(value) =>
									setNewRule((prev) => ({ ...prev, weekDay: value }))
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Weekday" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="0">Sunday</SelectItem>
									<SelectItem value="1">Monday</SelectItem>
									<SelectItem value="2">Tuesday</SelectItem>
									<SelectItem value="3">Wednesday</SelectItem>
									<SelectItem value="4">Thursday</SelectItem>
									<SelectItem value="5">Friday</SelectItem>
									<SelectItem value="6">Saturday</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>Start</Label>
							<Input
								type="time"
								value={newRule.startTime}
								onChange={(e) => updateNewStart(e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label>End</Label>
							<Input
								type="time"
								value={newRule.endTime}
								onChange={(e) => updateNewEnd(e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label>Duration</Label>
							<Select
								value={newRule.slotDuration}
								onValueChange={updateNewDuration}
							>
								<SelectTrigger>
									<SelectValue placeholder="Duration" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="30">30 mins</SelectItem>
									<SelectItem value="60">60 mins</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<Button
						onClick={() =>
							setConfirmAction({
								type: "add",
								ruleId: "new",
							})
						}
						disabled={addMutation.isPending}
					>
						Add Rule
					</Button>
				</CardContent>
			</Card>

			<Card className="border-border/60 shadow-sm">
				<CardHeader>
					<CardTitle className="text-xl">Recurring Rules</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					{isLoading && (
						<p className="text-sm text-muted-foreground">Loading...</p>
					)}
					{!isLoading && rules.length === 0 && (
						<p className="text-sm text-muted-foreground">No rules yet.</p>
					)}
					{rules.map((rule) => (
						<div
							key={rule.ruleId}
							className="flex items-center justify-between p-3 border border-border/60 rounded-lg"
						>
							<div className="space-y-1">
								<p className="font-medium">Weekday {rule.weekDay}</p>
								<p className="text-sm text-muted-foreground">
									{toTimeString(rule.startTime)} - {toTimeString(rule.endTime)}{" "}
									• {rule.slotDuration}m
								</p>
							</div>
							<div className="flex items-center gap-2">
								<Badge
									variant={rule.isActive === false ? "secondary" : "default"}
								>
									{rule.isActive === false ? "Disabled" : "Active"}
								</Badge>
								<Button
									variant="outline"
									size="sm"
									onClick={() => openEditDialog(rule.ruleId)}
								>
									Edit
								</Button>
								{rule.isActive === false ? (
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											setConfirmAction({
												type: "enable",
												ruleId: rule.ruleId,
											})
										}
									>
										Enable
									</Button>
								) : (
									<Button
										variant="outline"
										size="sm"
										onClick={() =>
											setConfirmAction({
												type: "disable",
												ruleId: rule.ruleId,
											})
										}
									>
										Disable
									</Button>
								)}
								<Button
									variant="destructive"
									size="sm"
									onClick={() =>
										setConfirmAction({
											type: "delete",
											ruleId: rule.ruleId,
										})
									}
								>
									Delete
								</Button>
							</div>
						</div>
					))}
				</CardContent>
			</Card>

			<Dialog
				open={Boolean(editingRuleId)}
				onOpenChange={() => setEditingRuleId(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit Rule</DialogTitle>
					</DialogHeader>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>Weekday</Label>
							<Select
								value={editRule.weekDay}
								onValueChange={(value) =>
									setEditRule((prev) => ({ ...prev, weekDay: value }))
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Weekday" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="0">Sunday</SelectItem>
									<SelectItem value="1">Monday</SelectItem>
									<SelectItem value="2">Tuesday</SelectItem>
									<SelectItem value="3">Wednesday</SelectItem>
									<SelectItem value="4">Thursday</SelectItem>
									<SelectItem value="5">Friday</SelectItem>
									<SelectItem value="6">Saturday</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>Duration</Label>
							<Select
								value={editRule.slotDuration}
								onValueChange={updateEditDuration}
							>
								<SelectTrigger>
									<SelectValue placeholder="Duration" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="30">30 mins</SelectItem>
									<SelectItem value="60">60 mins</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>Start</Label>
							<Input
								type="time"
								value={editRule.startTime}
								onChange={(e) => updateEditStart(e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label>End</Label>
							<Input
								type="time"
								value={editRule.endTime}
								onChange={(e) => updateEditEnd(e.target.value)}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							onClick={() => updateMutation.mutate()}
							disabled={updateMutation.isPending}
						>
							Save Changes
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<ConfirmModal
				isOpen={Boolean(confirmAction)}
				onClose={() => setConfirmAction(null)}
				onConfirm={confirmAndRun}
				title={
					confirmAction?.type === "add"
						? "Add Rule"
						: confirmAction?.type === "delete"
							? "Delete Rule"
							: confirmAction?.type === "disable"
								? "Disable Rule"
								: "Enable Rule"
				}
				message={
					confirmAction?.type === "add"
						? "Create this recurring rule and generate slots for the next week?"
						: confirmAction?.type === "delete"
							? "This will permanently remove the rule. Continue?"
							: confirmAction?.type === "disable"
								? "Disabled rules won't generate slots. Continue?"
								: "Enable this rule and allow slot generation?"
				}
				variant={confirmAction?.type === "delete" ? "destructive" : "default"}
				isLoading={
					enableMutation.isPending ||
					disableMutation.isPending ||
					deleteMutation.isPending ||
					addMutation.isPending
				}
				confirmText={
					confirmAction?.type === "add"
						? "Yes, Add"
						: confirmAction?.type === "delete"
							? "Yes, Delete"
							: confirmAction?.type === "disable"
								? "Yes, Disable"
								: "Yes, Enable"
				}
			/>
		</div>
	);
}

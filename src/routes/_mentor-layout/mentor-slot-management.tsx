import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { sessionSlotService } from "@/features/session-slot-management";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ConfirmModal } from "@/components/common/ConfirmModal";

export const Route = createFileRoute("/_mentor-layout/mentor-slot-management")({
	component: MentorSlotManagement,
});

function MentorSlotManagement() {
	const queryClient = useQueryClient();
	const [newSlot, setNewSlot] = useState({
		startTime: "",
		endTime: "",
		durationMinutes: "30",
	});
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		new Date(),
	);
	const [confirmAction, setConfirmAction] = useState<{
		type: "disable" | "delete";
		slotId: string;
	} | null>(null);
	const [isCreateConfirmOpen, setIsCreateConfirmOpen] = useState(false);

	const nowForInput = useMemo(() => {
		const now = new Date();
		const yyyy = now.getFullYear();
		const mm = String(now.getMonth() + 1).padStart(2, "0");
		const dd = String(now.getDate()).padStart(2, "0");
		const hh = String(now.getHours()).padStart(2, "0");
		const min = String(now.getMinutes()).padStart(2, "0");
		return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
	}, []);

	const parseDateTime = (value: string) => {
		if (!value) return null;
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return null;
		return date;
	};

	const formatDateTimeLocal = (date: Date) => {
		const yyyy = date.getFullYear();
		const mm = String(date.getMonth() + 1).padStart(2, "0");
		const dd = String(date.getDate()).padStart(2, "0");
		const hh = String(date.getHours()).padStart(2, "0");
		const min = String(date.getMinutes()).padStart(2, "0");
		return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
	};

	const updateCustomStart = (value: string) => {
		const start = parseDateTime(value);
		const duration = Number(newSlot.durationMinutes);
		if (!start || Number.isNaN(duration)) {
			setNewSlot((prev) => ({ ...prev, startTime: value }));
			return;
		}
		const end = new Date(start.getTime() + duration * 60000);
		setNewSlot((prev) => ({
			...prev,
			startTime: value,
			endTime: formatDateTimeLocal(end),
		}));
	};

	const updateCustomEnd = (value: string) => {
		const end = parseDateTime(value);
		const duration = Number(newSlot.durationMinutes);
		if (!end || Number.isNaN(duration)) {
			setNewSlot((prev) => ({ ...prev, endTime: value }));
			return;
		}
		const start = new Date(end.getTime() - duration * 60000);
		setNewSlot((prev) => ({
			...prev,
			endTime: value,
			startTime: formatDateTimeLocal(start),
		}));
	};

	const updateCustomDuration = (value: string) => {
		const duration = Number(value);
		const start = parseDateTime(newSlot.startTime);
		const end = parseDateTime(newSlot.endTime);

		if (start) {
			const nextEnd = new Date(start.getTime() + duration * 60000);
			setNewSlot((prev) => ({
				...prev,
				durationMinutes: value,
				endTime: formatDateTimeLocal(nextEnd),
			}));
			return;
		}

		if (end) {
			const nextStart = new Date(end.getTime() - duration * 60000);
			setNewSlot((prev) => ({
				...prev,
				durationMinutes: value,
				startTime: formatDateTimeLocal(nextStart),
			}));
			return;
		}

		setNewSlot((prev) => ({ ...prev, durationMinutes: value }));
	};

	const selectedRange = useMemo(() => {
		if (!selectedDate) return undefined;
		const start = new Date(selectedDate);
		start.setHours(0, 0, 0, 0);
		const end = new Date(selectedDate);
		end.setHours(23, 59, 59, 999);
		return { startDate: start.toISOString(), endDate: end.toISOString() };
	}, [selectedDate]);

	const { data: daySlotsData, isLoading: isDayLoading } = useQuery({
		queryKey: ["mentor-slots", "day", selectedRange?.startDate],
		queryFn: () =>
			sessionSlotService.getMentorSlots(selectedRange ?? undefined),
		enabled: Boolean(selectedRange),
	});

	const createMutation = useMutation({
		mutationFn: () =>
			sessionSlotService.createCustomSlot({
				startTime: new Date(newSlot.startTime).toISOString(),
				endTime: new Date(newSlot.endTime).toISOString(),
				durationMinutes: Number(newSlot.durationMinutes) as 30 | 60,
			}),
		onSuccess: () => {
			toast.success("Slot created");
			queryClient.invalidateQueries({ queryKey: ["mentor-slots"] });
			queryClient.invalidateQueries({ queryKey: ["mentor-slots", "day"] });
			setNewSlot({ startTime: "", endTime: "", durationMinutes: "30" });
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Failed to create slot");
		},
	});

	const cancelMutation = useMutation({
		mutationFn: (slotId: string) => sessionSlotService.cancelSlot({ slotId }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["mentor-slots"] });
			queryClient.invalidateQueries({ queryKey: ["mentor-slots", "day"] });
		},
	});

	const enableMutation = useMutation({
		mutationFn: (slotId: string) => sessionSlotService.enableSlot({ slotId }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["mentor-slots"] });
			queryClient.invalidateQueries({ queryKey: ["mentor-slots", "day"] });
		},
	});

	const deleteMutation = useMutation({
		mutationFn: (slotId: string) => sessionSlotService.deleteSlot({ slotId }),
		onSuccess: () => {
			toast.success("Slot deleted");
			queryClient.invalidateQueries({ queryKey: ["mentor-slots"] });
			queryClient.invalidateQueries({ queryKey: ["mentor-slots", "day"] });
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Failed to delete slot");
		},
	});

	const daySlots = daySlotsData?.data.slots ?? [];
	const formatDate = (date: Date) =>
		date.toLocaleDateString("en-GB", {
			day: "2-digit",
			month: "2-digit",
			year: "2-digit",
		});
	const timeFormatter = useMemo(
		() =>
			new Intl.DateTimeFormat("en-GB", {
				hour: "2-digit",
				minute: "2-digit",
				timeZone: "Asia/Kolkata",
			}),
		[],
	);
	const formatTime = (value: string | Date) =>
		timeFormatter.format(typeof value === "string" ? new Date(value) : value);
	const confirmAndRun = () => {
		if (!confirmAction) return;
		if (confirmAction.type === "disable") {
			cancelMutation.mutate(confirmAction.slotId);
		}
		if (confirmAction.type === "delete") {
			deleteMutation.mutate(confirmAction.slotId);
		}
		setConfirmAction(null);
	};
	const confirmCreateSlot = () => {
		setIsCreateConfirmOpen(false);
		createMutation.mutate();
	};

	return (
		<div className="p-8 space-y-6">
			<Card className="border-border/60 shadow-sm">
				<CardHeader>
					<CardTitle className="text-2xl">Slot Management</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						View and manage your generated slots.
					</p>
				</CardContent>
			</Card>

			<Card className="border-border/60 shadow-sm">
				<CardHeader>
					<CardTitle className="text-xl">Create Custom Slot</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="space-y-2">
							<Label>Start</Label>
							<Input
								type="datetime-local"
								value={newSlot.startTime}
								onChange={(e) => updateCustomStart(e.target.value)}
								min={nowForInput}
							/>
						</div>
						<div className="space-y-2">
							<Label>End</Label>
							<Input
								type="datetime-local"
								value={newSlot.endTime}
								onChange={(e) => updateCustomEnd(e.target.value)}
								min={nowForInput}
							/>
						</div>
						<div className="space-y-2">
							<Label>Duration</Label>
							<Select
								value={newSlot.durationMinutes}
								onValueChange={updateCustomDuration}
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
						onClick={() => {
							const start = parseDateTime(newSlot.startTime);
							const end = parseDateTime(newSlot.endTime);
							if (!start || !end) {
								toast.error("Please select both start and end time.");
								return;
							}
							setIsCreateConfirmOpen(true);
						}}
						disabled={createMutation.isPending}
					>
						Create Slot
					</Button>
				</CardContent>
			</Card>

			<Card className="border-border/60 shadow-sm">
				<CardHeader>
					<CardTitle className="text-xl">Upcoming Slots</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
						<div className="border border-border/60 rounded-lg p-3">
							<Calendar
								mode="single"
								selected={selectedDate}
								onSelect={(date) => setSelectedDate(date ?? undefined)}
								className="w-full"
							/>
						</div>
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<h3 className="font-semibold">Slots for day</h3>
								{selectedDate && (
									<span className="text-sm text-muted-foreground">
										{formatDate(selectedDate)}
									</span>
								)}
							</div>
							{isDayLoading && (
								<p className="text-sm text-muted-foreground">Loading...</p>
							)}
							{!isDayLoading && daySlots.length === 0 && (
								<p className="text-sm text-muted-foreground">
									No slots for selected day.
								</p>
							)}
							{daySlots.map((slot) => (
								<div
									key={slot.id}
									className="flex items-center justify-between p-3 border border-border/60 rounded-lg"
								>
									<div className="space-y-1">
										<p className="font-medium">
											{formatTime(slot.startTime)} - {formatTime(slot.endTime)}
										</p>
										<p className="text-sm text-muted-foreground">
											{slot.durationMinutes} mins • {slot.price} coins
										</p>
									</div>
									<div className="flex items-center gap-2">
										<Badge
											variant={
												slot.status === "available"
													? "default"
													: slot.status === "booked"
														? "secondary"
														: "outline"
											}
										>
											{slot.status}
										</Badge>
										{slot.status === "available" && (
											<Button
												variant="outline"
												size="sm"
												onClick={() =>
													setConfirmAction({
														type: "disable",
														slotId: slot.id,
													})
												}
											>
												Disable
											</Button>
										)}
										{slot.status === "blocked" && (
											<Button
												variant="outline"
												size="sm"
												onClick={() => enableMutation.mutate(slot.id)}
											>
												Re-enable
											</Button>
										)}
										<Button
											variant="destructive"
											size="sm"
											onClick={() =>
												setConfirmAction({
													type: "delete",
													slotId: slot.id,
												})
											}
										>
											Delete
										</Button>
									</div>
								</div>
							))}
						</div>
					</div>
				</CardContent>
			</Card>
			<ConfirmModal
				isOpen={Boolean(confirmAction)}
				onClose={() => setConfirmAction(null)}
				onConfirm={confirmAndRun}
				title={
					confirmAction?.type === "delete" ? "Delete Slot" : "Disable Slot"
				}
				message={
					confirmAction?.type === "delete"
						? "This will permanently remove the slot. Continue?"
						: "Disable this slot so it is no longer bookable?"
				}
				variant={confirmAction?.type === "delete" ? "destructive" : "default"}
				isLoading={deleteMutation.isPending || cancelMutation.isPending}
				confirmText={
					confirmAction?.type === "delete" ? "Yes, Delete" : "Yes, Disable"
				}
			/>
			<ConfirmModal
				isOpen={isCreateConfirmOpen}
				onClose={() => setIsCreateConfirmOpen(false)}
				onConfirm={confirmCreateSlot}
				title="Create custom slot"
				message="Are you sure you want to create this slot?"
				confirmText="Create Slot"
				isLoading={createMutation.isPending}
			/>
		</div>
	);
}

import { useState } from "react";
import { format } from "date-fns";
import { Calendar, ArrowLeft } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { useRescheduleBooking } from "../hooks/useRescheduleBooking";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type { ApiSuccess } from "@/api/apiSuccess";
import type { AvailabilitySlot } from "@/features/availability/types";
import { BookingCalendarSelector } from "@/features/mentor-public-profile/components/BookingCalendarSelector";

interface RescheduleSessionModalProps {
	isOpen: boolean;
	onClose: () => void;
	bookingId: string;
	mentorId: string;
}

export function RescheduleSessionModal({
	isOpen,
	onClose,
	bookingId,
	mentorId,
}: RescheduleSessionModalProps) {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		new Date(),
	);
	const [bookingSlotId, setBookingSlotId] = useState<string | null>(null);
	const [pendingSlot, setPendingSlot] = useState<AvailabilitySlot | null>(null);

	const { mutate: reschedule, isPending } = useRescheduleBooking();

	const { data: slotsData, isLoading: isLoadingSlots } = useQuery({
		queryKey: ["available-slots", mentorId, selectedDate],
		queryFn: async () => {
			if (!selectedDate) return { slots: [] };
			const response = await api.get<ApiSuccess<{ slots: AvailabilitySlot[] }>>(
				`${ROUTES.BOOKINGS.BASE}${ROUTES.BOOKINGS.SLOTS(mentorId)}`,
				{
					params: {
						date: format(selectedDate, "yyyy-MM-dd"),
					},
				},
			);
			return response.data.data;
		},
		enabled: !!selectedDate && !!mentorId && isOpen,
	});

	const handleReschedule = (slot: AvailabilitySlot) => {
		setPendingSlot(slot);
	};

	const confirmReschedule = () => {
		if (!pendingSlot) return;

		setBookingSlotId(pendingSlot.startTime);
		reschedule(
			{
				bookingId,
				startTime: pendingSlot.startTime,
				endTime: pendingSlot.endTime,
			},
			{
				onSuccess: () => {
					onClose();
					setPendingSlot(null);
				},
				onSettled: () => {
					setBookingSlotId(null);
				},
			},
		);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent
				className={cn(
					"p-0 overflow-hidden bg-background/95 backdrop-blur-xl border-border/60 shadow-2xl",
					pendingSlot ? "sm:max-w-md" : "sm:max-w-4xl",
				)}
			>
				<div className="p-6">
					<DialogHeader className={pendingSlot ? "mb-4" : "mb-6"}>
						<DialogTitle className="text-2xl font-bold">
							{pendingSlot ? "Confirm Reschedule" : "Reschedule Session"}
						</DialogTitle>
						<DialogDescription>
							{pendingSlot
								? "Please review the new session details before confirming."
								: "Select a new date and time for your session. Changes must be made at least 24 hours in advance."}
						</DialogDescription>
					</DialogHeader>

					<div className="mt-2">
						{pendingSlot ? (
							<div className="space-y-4 py-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
								<div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
									<div className="flex items-center gap-3 mb-4">
										<div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
											<Calendar className="w-5 h-5 text-primary" />
										</div>
										<div>
											<p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
												New Schedule
											</p>
											<p className="text-base font-bold">
												{format(
													new Date(pendingSlot.startTime),
													"EEEE, MMMM d, yyyy",
												)}
											</p>
										</div>
									</div>

									<div className="grid grid-cols-2 gap-3">
										<div className="p-3 bg-background/50 rounded-xl border border-border/50">
											<p className="text-xs text-muted-foreground mb-0.5">
												Start Time
											</p>
											<p className="text-lg font-bold text-primary">
												{format(new Date(pendingSlot.startTime), "h:mm a")}
											</p>
										</div>
										<div className="p-3 bg-background/50 rounded-xl border border-border/50">
											<p className="text-xs text-muted-foreground mb-0.5">
												End Time
											</p>
											<p className="text-lg font-bold text-primary">
												{format(new Date(pendingSlot.endTime), "h:mm a")}
											</p>
										</div>
									</div>
								</div>

								<div className="flex flex-col sm:flex-row gap-2">
									<Button
										variant="ghost"
										onClick={() => setPendingSlot(null)}
										className="flex-1 h-10 text-sm font-medium"
										disabled={isPending}
									>
										<ArrowLeft className="w-4 h-4 mr-2" />
										Back
									</Button>
									<Button
										onClick={confirmReschedule}
										className="flex-[2] h-10 text-sm font-bold shadow-lg shadow-primary/20"
										disabled={isPending}
									>
										{isPending ? "Rescheduling..." : "Confirm & Reschedule"}
									</Button>
								</div>
							</div>
						) : (
							<BookingCalendarSelector
								today={new Date()}
								selectedDate={selectedDate}
								setSelectedDate={setSelectedDate}
								isLoading={isLoadingSlots}
								availableSlots={slotsData?.slots || []}
								handleBookClick={handleReschedule}
								bookingSlotId={bookingSlotId}
								isBooking={isPending}
								layout="horizontal"
								bookLabel="Choose Slot"
							/>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

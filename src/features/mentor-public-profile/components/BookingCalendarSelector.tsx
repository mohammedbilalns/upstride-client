import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/Calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { AvailabilitySlot } from "@/features/availability-management/types";
import {
	formatLocaleDateLong,
	formatLocaleTimeShort,
} from "@/shared/utils/date";

interface BookingCalendarSelectorProps {
	today: Date;
	selectedDate: Date | undefined;
	setSelectedDate: (date: Date | undefined) => void;
	isLoading: boolean;
	availableSlots: AvailabilitySlot[];
	handleBookClick: (slot: AvailabilitySlot) => void;
	bookingSlotId: string | null;
	isBooking: boolean;
}

export function BookingCalendarSelector({
	today,
	selectedDate,
	setSelectedDate,
	isLoading,
	availableSlots,
	handleBookClick,
	bookingSlotId,
	isBooking,
}: BookingCalendarSelectorProps) {
	return (
		<Card className="border-border/60 shadow-sm h-fit">
			<CardHeader className="flex flex-col gap-2">
				<CardTitle className="text-lg">Pick a day</CardTitle>
				<p className="text-sm text-muted-foreground">
					Choose a date to see available slots.
				</p>
			</CardHeader>
			<CardContent className="grid grid-cols-1 gap-6">
				<div className="border border-border/60 rounded-lg p-3 mx-auto w-full max-w-sm">
					<Calendar
						mode="single"
						selected={selectedDate}
						onSelect={(date) => setSelectedDate(date ?? undefined)}
						fromDate={today}
						disabled={(date) => date < today}
						className="w-full"
					/>
				</div>
				<div className="space-y-3">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-1">
						<h3 className="font-semibold">Available slots</h3>
						{selectedDate && (
							<span className="text-sm text-muted-foreground">
								{formatLocaleDateLong(selectedDate)}
							</span>
						)}
					</div>
					{isLoading && (
						<p className="text-sm text-muted-foreground">Loading slots...</p>
					)}
					{!isLoading && availableSlots.length === 0 && (
						<p className="text-sm text-muted-foreground">
							No available slots for this day.
						</p>
					)}
					<div className="grid grid-cols-1 gap-3">
						{availableSlots.map((slot) => (
							<div
								key={slot.startTime}
								className="flex flex-wrap sm:flex-nowrap items-center justify-between rounded-lg border border-border/60 p-3 gap-2"
							>
								<div>
									<p className="font-medium text-sm">
										{formatLocaleTimeShort(slot.startTime)} -{" "}
										{formatLocaleTimeShort(slot.endTime)}
									</p>
									<p className="text-xs text-muted-foreground">
										{slot.durationMinutes} mins · {slot.price} coins
									</p>
								</div>
								<div className="flex items-center gap-2">
									<Badge variant="secondary" className="hidden sm:inline-flex">
										Available
									</Badge>
									<Button
										size="sm"
										onClick={() => handleBookClick(slot)}
										disabled={isBooking && bookingSlotId === slot.startTime}
									>
										{isBooking && bookingSlotId === slot.startTime
											? "Booking..."
											: "Book"}
									</Button>
								</div>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

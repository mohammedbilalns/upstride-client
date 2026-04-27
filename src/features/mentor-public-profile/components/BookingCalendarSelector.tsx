import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Calendar } from "@/components/ui/Calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ScrollArea } from "@/components/ui/ScrollArea";
import type { AvailabilitySlot } from "@/features/availability/types";
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
		<div className="space-y-4 xl:sticky xl:top-6">
			<Card className="border-border/60 shadow-sm">
				<CardHeader className="flex flex-col gap-2">
					<CardTitle className="text-lg">Pick a day</CardTitle>
					<p className="text-sm text-muted-foreground">
						Choose a date to see available slots.
					</p>
				</CardHeader>
				<CardContent>
					<div className="mx-auto w-full max-w-sm rounded-2xl border border-border/60 bg-background/60 p-3">
						<Calendar
							mode="single"
							selected={selectedDate}
							onSelect={(date) => setSelectedDate(date ?? undefined)}
							fromDate={today}
							disabled={(date) => date < today}
							className="w-full"
						/>
					</div>
				</CardContent>
			</Card>

			<Card className="border-border/60 shadow-sm">
				<CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<CardTitle className="text-lg">Available slots</CardTitle>
						<p className="text-sm text-muted-foreground">
							Choose a time that works for you.
						</p>
					</div>
					{selectedDate && (
						<span className="text-sm text-muted-foreground">
							{formatLocaleDateLong(selectedDate)}
						</span>
					)}
				</CardHeader>
				<CardContent>
					{isLoading && (
						<p className="text-sm text-muted-foreground">Loading slots...</p>
					)}
					{!isLoading && availableSlots.length === 0 && (
						<div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 px-4 py-8 text-sm text-muted-foreground">
							No slots for this day.
						</div>
					)}
					{!isLoading && availableSlots.length > 0 && (
						<ScrollArea className="xl:h-[34rem]">
							<div className="grid grid-cols-1 gap-2 xl:pr-3">
								{availableSlots.map((slot) => (
									<div
										key={slot.startTime}
										className={`flex items-center justify-between gap-3 rounded-xl border border-border/60 px-3 py-2.5 ${
											slot.status === "AVAILABLE"
												? "bg-background"
												: "bg-muted/40"
										}`}
									>
										<div className="min-w-0">
											<p className="font-medium text-sm">
												{formatLocaleTimeShort(slot.startTime)} -{" "}
												{formatLocaleTimeShort(slot.endTime)}
											</p>
											<p className="text-xs text-muted-foreground">
												{slot.durationMinutes} mins · {slot.price} coins
											</p>
										</div>
										<div className="flex shrink-0 items-center gap-2">
											{slot.status === "AVAILABLE" ? (
												<>
													<Badge
														variant="secondary"
														className="hidden sm:inline-flex"
													>
														Available
													</Badge>
													<Button
														size="sm"
														className="h-8 rounded-lg px-4"
														onClick={() => handleBookClick(slot)}
														disabled={
															isBooking && bookingSlotId === slot.startTime
														}
													>
														{isBooking && bookingSlotId === slot.startTime
															? "Booking..."
															: "Book"}
													</Button>
												</>
											) : (
												<Badge
													variant="outline"
													className="hidden sm:inline-flex border-amber-300 text-amber-700 dark:border-amber-900 dark:text-amber-300"
												>
													{slot.status === "BOOKED_PENDING"
														? "payment pending"
														: "Booked"}
												</Badge>
											)}
										</div>
									</div>
								))}
							</div>
						</ScrollArea>
					)}
				</CardContent>
			</Card>
		</div>
	);
}

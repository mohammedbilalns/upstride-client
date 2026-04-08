import { Coins, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { BookingDto } from "@/features/session-booking-management/types";
import { formatDateShort, formatTimeShort } from "@/shared/utils/date";

interface SessionDetailsDialogProps {
	isOpen: boolean;
	onClose: (open: boolean) => void;
	selectedBooking: BookingDto | null;
	personLabel?: string;
	personName?: string | null;
}

export function SessionDetailsDialog({
	isOpen,
	onClose,
	selectedBooking,
	personLabel = "Mentor",
	personName,
}: SessionDetailsDialogProps) {
	const isCancelled =
		selectedBooking?.status === "CANCELLED_BY_MENTEE" ||
		selectedBooking?.status === "CANCELLED_BY_MENTOR";
	const paymentStatusLabel = selectedBooking
		? selectedBooking.paymentStatus === "COMPLETED"
			? "Payment completed"
			: selectedBooking.paymentStatus === "PENDING"
				? "Payment pending"
				: selectedBooking.paymentStatus === "FAILED"
					? "Payment failed"
					: "Payment refunded"
		: "";

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-140">
				<DialogHeader>
					<DialogTitle>Session Details</DialogTitle>
				</DialogHeader>

				{selectedBooking && (
					<div className="space-y-4 text-sm">
						<div className="space-y-1">
							<p className="text-xs uppercase tracking-wide text-muted-foreground">
								{personLabel}
							</p>
							<p className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
								{personName ?? selectedBooking.mentorName ?? personLabel}
							</p>
						</div>

						<div className="grid gap-3 sm:grid-cols-2">
							<div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800 p-3">
								<p className="text-xs uppercase tracking-wide text-muted-foreground">
									Session Date
								</p>
								<p className="mt-1 font-medium">
									{formatDateShort(selectedBooking.startTime)}
								</p>
								<p className="text-xs text-muted-foreground">
									{formatTimeShort(selectedBooking.startTime)} -{" "}
									{formatTimeShort(selectedBooking.endTime)}
								</p>
							</div>
							<div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800 p-3">
								<p className="text-xs uppercase tracking-wide text-muted-foreground">
									Booked On
								</p>
								<p className="mt-1 font-medium">
									{formatDateShort(selectedBooking.createdAt)}
								</p>
							</div>
						</div>

						<div className="flex flex-wrap items-center gap-2">
							<Badge variant="outline" className="text-[10px] uppercase">
								{selectedBooking.status}
							</Badge>
							<Badge variant="secondary" className="text-[10px] uppercase">
								{paymentStatusLabel}
							</Badge>
							<span className="flex items-center gap-1 text-xs font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900/50 px-2 py-0.5 rounded-md">
								{selectedBooking.paymentType === "COINS" ? (
									<Coins className="h-3 w-3 text-amber-500" />
								) : (
									<CreditCard className="h-3 w-3 text-blue-500" />
								)}
								{selectedBooking.totalAmount}{" "}
								{selectedBooking.currency === "inr"
									? "₹"
									: selectedBooking.currency}
							</span>
						</div>

						{!isCancelled && (
							<div className="space-y-1">
								<p className="text-xs uppercase tracking-wide text-muted-foreground">
									Meeting Link
								</p>
								{selectedBooking.meetingLink &&
								selectedBooking.meetingLink !== "Pending" ? (
									<a
										href={selectedBooking.meetingLink}
										target="_blank"
										rel="noreferrer"
										className="text-primary font-medium hover:underline break-all"
									>
										{selectedBooking.meetingLink}
									</a>
								) : (
									<p className="text-muted-foreground">Pending</p>
								)}
							</div>
						)}

						{selectedBooking.notes && (
							<div className="rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 p-3">
								<p className="text-xs uppercase tracking-wide text-muted-foreground">
									Notes
								</p>
								<p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
									{selectedBooking.notes}
								</p>
							</div>
						)}
					</div>
				)}

				<DialogFooter>
					<DialogClose asChild>
						<Button type="button" variant="outline">
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

import { Link } from "@tanstack/react-router";
import { Coins, CreditCard, Download, Video } from "lucide-react";
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
import type { Booking } from "@/features/session-booking-management/types";
import { formatDateShort, formatTimeShort } from "@/shared/utils/date";

interface SessionDetailsDialogProps {
	isOpen: boolean;
	onClose: (open: boolean) => void;
	selectedBooking: Booking | null;
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
	const canJoinMeeting =
		Boolean(selectedBooking) &&
		!isCancelled &&
		selectedBooking.status !== "COMPLETED" &&
		selectedBooking.status !== "PENDING" &&
		new Date(selectedBooking.endTime).getTime() >= Date.now();
	const canDownloadReceipt =
		Boolean(selectedBooking) &&
		(selectedBooking.status === "CONFIRMED" ||
			selectedBooking.status === "STARTED" ||
			selectedBooking.status === "COMPLETED");
	const paymentStatusLabel = selectedBooking
		? selectedBooking.paymentStatus === "COMPLETED"
			? "Payment completed"
			: selectedBooking.paymentStatus === "PENDING"
				? "Payment pending"
				: selectedBooking.paymentStatus === "FAILED"
					? "Payment failed"
					: "Payment refunded"
		: "";
	const bookingStatusLabel = selectedBooking
		? selectedBooking.status === "STARTED"
			? "Ongoing"
			: selectedBooking.status === "COMPLETED"
				? "Completed"
				: selectedBooking.status === "CONFIRMED"
					? "Confirmed"
					: selectedBooking.status === "PENDING"
						? "Payment Pending"
						: selectedBooking.status === "CANCELLED_BY_MENTEE"
							? "Cancelled by mentee"
							: "Cancelled by mentor"
		: "";

	const handleDownloadReceipt = () => {
		if (!selectedBooking) return;

		const receiptLines = [
			"Upstride Session Receipt",
			`Receipt Date: ${new Date().toLocaleString()}`,
			`Booking ID: ${selectedBooking.id}`,
			`Status: ${bookingStatusLabel}`,
			`Payment Status: ${paymentStatusLabel}`,
			`${personLabel}: ${personName ?? selectedBooking.mentorName ?? personLabel}`,
			`Session Date: ${formatDateShort(selectedBooking.startTime)}`,
			`Session Time: ${formatTimeShort(selectedBooking.startTime)} - ${formatTimeShort(selectedBooking.endTime)}`,
			`Amount: ${selectedBooking.totalAmount} ${selectedBooking.currency.toUpperCase()}`,
			`Payment Type: ${selectedBooking.paymentType}`,
		];

		if (selectedBooking.notes) {
			receiptLines.push(`Notes: ${selectedBooking.notes}`);
		}

		const blob = new Blob([receiptLines.join("\n")], {
			type: "text/plain;charset=utf-8",
		});
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = `receipt-${selectedBooking.id}.txt`;
		document.body.appendChild(anchor);
		anchor.click();
		anchor.remove();
		URL.revokeObjectURL(url);
	};

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
								{bookingStatusLabel}
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

						{canJoinMeeting && (
							<div className="space-y-1">
								<p className="text-xs uppercase tracking-wide text-muted-foreground">
									Virtual Meeting Room
								</p>
								<Link
									to="/call/$bookingId"
									params={{ bookingId: selectedBooking.id }}
									className="flex items-center gap-2 text-primary font-medium hover:underline bg-primary/5 px-3 py-2 rounded-xl"
								>
									<Video className="h-4 w-4" />
									<span>Join Meeting Room</span>
								</Link>
							</div>
						)}

						{canDownloadReceipt && (
							<div className="space-y-1">
								<p className="text-xs uppercase tracking-wide text-muted-foreground">
									Receipt
								</p>
								<Button
									type="button"
									variant="outline"
									onClick={handleDownloadReceipt}
									className="rounded-xl"
								>
									<Download className="h-4 w-4" />
									<span>Download Receipt</span>
								</Button>
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

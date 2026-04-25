import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Coins, CreditCard, Download, Video } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/Dialog";
import { Textarea } from "@/components/ui/Textarea";
import type { Booking } from "@/features/session-booking/types";
import { cn } from "@/shared/utils/cn";
import { formatDateShort, formatTimeShort } from "@/shared/utils/date";

interface SessionDetailsDialogProps {
	isOpen: boolean;
	onClose: (open: boolean) => void;
	selectedBooking: Booking | null;
	personLabel?: string;
	personName?: string | null;
	showReceipt?: boolean;
	canSubmitReview?: boolean;
	onSubmitReview?: (input: {
		rating: number;
		comment: string;
	}) => Promise<void>;
	isSubmittingReview?: boolean;
}

export function SessionDetailsDialog({
	isOpen,
	onClose,
	selectedBooking,
	personLabel = "Mentor",
	personName,
	showReceipt = true,
	canSubmitReview = false,
	onSubmitReview,
	isSubmittingReview = false,
}: SessionDetailsDialogProps) {
	const [reviewRating, setReviewRating] = useState(0);
	const [reviewComment, setReviewComment] = useState("");
	const booking = selectedBooking;
	const existingReview = booking?.review ?? null;

	useEffect(() => {
		if (!isOpen) return;
		setReviewRating(existingReview?.rating ?? 0);
		setReviewComment(existingReview?.comment ?? "");
	}, [existingReview?.comment, existingReview?.rating, isOpen]);

	if (!booking) {
		return (
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent className="sm:max-w-140">
					<DialogHeader>
						<DialogTitle>Session Details</DialogTitle>
					</DialogHeader>
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

	const isCancelled =
		booking.status === "CANCELLED_BY_MENTEE" ||
		booking.status === "CANCELLED_BY_MENTOR";
	const canJoinMeeting =
		!isCancelled &&
		booking.status !== "COMPLETED" &&
		booking.status !== "PENDING" &&
		new Date(booking.endTime).getTime() >= Date.now();
	const canDownloadReceipt =
		booking.status === "CONFIRMED" ||
		booking.status === "STARTED" ||
		booking.status === "COMPLETED";
	const canReviewSession =
		canSubmitReview &&
		booking.status === "COMPLETED" &&
		booking.paymentStatus === "COMPLETED" &&
		Boolean(booking.settledAt) &&
		!existingReview;
	const review = booking.review;
	const paymentStatusLabel = booking
		? booking.paymentStatus === "COMPLETED"
			? "Payment completed"
			: booking.paymentStatus === "PENDING"
				? "Payment pending"
				: booking.paymentStatus === "FAILED"
					? "Payment failed"
					: "Payment refunded"
		: "";
	const bookingStatusLabel = booking
		? booking.status === "STARTED"
			? "Ongoing"
			: booking.status === "COMPLETED"
				? "Completed"
				: booking.status === "CONFIRMED"
					? "Confirmed"
					: booking.status === "PENDING"
						? "Payment Pending"
						: booking.status === "CANCELLED_BY_MENTEE"
							? "Cancelled by mentee"
							: "Cancelled by mentor"
		: "";

	const handleDownloadReceipt = () => {
		if (!booking) return;

		const receiptLines = [
			"Upstride Session Receipt",
			`Receipt Date: ${new Date().toLocaleString()}`,
			`Booking ID: ${booking.id}`,
			`Status: ${bookingStatusLabel}`,
			`Payment Status: ${paymentStatusLabel}`,
			`${personLabel}: ${personName ?? booking.mentorName ?? personLabel}`,
			`Session Date: ${formatDateShort(booking.startTime)}`,
			`Session Time: ${formatTimeShort(booking.startTime)} - ${formatTimeShort(booking.endTime)}`,
			`Amount: ${booking.totalAmount} ${booking.currency.toUpperCase()}`,
			`Payment Type: ${booking.paymentType}`,
		];

		if (booking.notes) {
			receiptLines.push(`Notes: ${booking.notes}`);
		}

		const blob = new Blob([receiptLines.join("\n")], {
			type: "text/plain;charset=utf-8",
		});
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = `receipt-${booking.id}.txt`;
		document.body.appendChild(anchor);
		anchor.click();
		anchor.remove();
		URL.revokeObjectURL(url);
	};

	const handleReviewSubmit = async () => {
		if (!booking || !onSubmitReview || reviewRating < 1) return;
		await onSubmitReview({
			rating: reviewRating,
			comment: reviewComment.trim(),
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-140">
				<DialogHeader>
					<DialogTitle>Session Details</DialogTitle>
				</DialogHeader>

				{booking && (
					<div className="space-y-4 text-sm">
						<div className="space-y-1">
							<p className="text-xs uppercase tracking-wide text-muted-foreground">
								{personLabel}
							</p>
							<p className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
								{personName ?? booking.mentorName ?? personLabel}
							</p>
						</div>

						<div className="grid gap-3 sm:grid-cols-2">
							<div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800 p-3">
								<p className="text-xs uppercase tracking-wide text-muted-foreground">
									Session Date
								</p>
								<p className="mt-1 font-medium">
									{formatDateShort(booking.startTime)}
								</p>
								<p className="text-xs text-muted-foreground">
									{formatTimeShort(booking.startTime)} -{" "}
									{formatTimeShort(booking.endTime)}
								</p>
							</div>
							<div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800 p-3">
								<p className="text-xs uppercase tracking-wide text-muted-foreground">
									Booked On
								</p>
								<p className="mt-1 font-medium">
									{formatDateShort(booking.createdAt)}
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
								{booking.paymentType === "COINS" ? (
									<Coins className="h-3 w-3 text-amber-500" />
								) : (
									<CreditCard className="h-3 w-3 text-blue-500" />
								)}
								{booking.totalAmount}{" "}
								{booking.currency === "inr" ? "₹" : booking.currency}
							</span>
						</div>

						{review && (
							<div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800 p-4 space-y-3">
								<div className="flex items-center justify-between gap-3">
									<div>
										<p className="text-xs uppercase tracking-wide text-muted-foreground">
											Your Review
										</p>
										<p className="mt-1 text-sm font-medium">
											{submittedReviewLabel(review.rating)}
										</p>
									</div>
									<div className="flex items-center gap-1 text-amber-500">
										{[1, 2, 3, 4, 5].map((star) => (
											<Star
												key={star}
												className={cn(
													"h-4 w-4",
													star <= review.rating && "fill-current",
												)}
											/>
										))}
									</div>
								</div>
								<p className="text-sm text-muted-foreground">
									{review.comment}
								</p>
							</div>
						)}

						{canReviewSession && (
							<div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800 p-4 space-y-4">
								<div>
									<p className="text-xs uppercase tracking-wide text-muted-foreground">
										Leave a review
									</p>
									<p className="mt-1 text-sm text-muted-foreground">
										Rate this completed session and share a short note.
									</p>
								</div>
								<div className="flex items-center gap-1 text-amber-500">
									{[1, 2, 3, 4, 5].map((star) => (
										<button
											type="button"
											key={star}
											onClick={() => setReviewRating(star)}
											className="rounded"
										>
											<Star
												className={cn(
													"h-5 w-5 transition-colors",
													star <= reviewRating
														? "fill-current"
														: "text-zinc-300 dark:text-zinc-700",
												)}
											/>
										</button>
									))}
								</div>
								<Textarea
									value={reviewComment}
									onChange={(e) => setReviewComment(e.target.value)}
									placeholder="Write your feedback..."
									className="min-h-[100px]"
								/>
								<div className="flex justify-end">
									<Button
										type="button"
										onClick={handleReviewSubmit}
										disabled={
											isSubmittingReview ||
											reviewRating < 1 ||
											!reviewComment.trim()
										}
									>
										{isSubmittingReview ? "Submitting..." : "Submit Review"}
									</Button>
								</div>
							</div>
						)}

						{canJoinMeeting && (
							<div className="space-y-1">
								<p className="text-xs uppercase tracking-wide text-muted-foreground">
									Virtual Meeting Room
								</p>
								<Link
									to="/call/$bookingId"
									params={{ bookingId: booking.id }}
									className="flex items-center gap-2 text-primary font-medium hover:underline bg-primary/5 px-3 py-2 rounded-xl"
								>
									<Video className="h-4 w-4" />
									<span>Join Meeting Room</span>
								</Link>
							</div>
						)}

						{showReceipt && canDownloadReceipt && (
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

						{booking.notes && (
							<div className="rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 p-3">
								<p className="text-xs uppercase tracking-wide text-muted-foreground">
									Notes
								</p>
								<p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
									{booking.notes}
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

const submittedReviewLabel = (rating: number) => {
	if (rating >= 5) return "Excellent";
	if (rating >= 4) return "Good";
	if (rating >= 3) return "Average";
	if (rating >= 2) return "Below average";
	return "Poor";
};

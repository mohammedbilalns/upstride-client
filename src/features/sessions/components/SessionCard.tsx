import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import {
	Calendar,
	Clock,
	Video,
	XCircle,
	CreditCard,
	Coins,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BookingDto } from "@/features/session-booking-management/types";

const formatDate = (value: string) => format(new Date(value), "MMM dd, yyyy");
const formatTime = (value: string) => format(new Date(value), "hh:mm a");

export function SessionCard({
	booking,
	showCancel,
	onViewDetails,
	onCancel,
	onRepay,
	isCancelling,
	isRepaying,
}: {
	booking: BookingDto;
	showCancel: boolean;
	onViewDetails: () => void;
	onCancel: () => void;
	onRepay: () => void;
	isCancelling: boolean;
	isRepaying: boolean;
}) {
	const timeUntilStartMs = new Date(booking.startTime).getTime() - Date.now();
	const isCancelled = booking.status.startsWith("CANCELLED");
	const isUpcoming =
		(booking.status === "CONFIRMED" || booking.status === "PENDING") &&
		timeUntilStartMs >= 0;

	const showMeetingInfo =
		isUpcoming &&
		!isCancelled &&
		timeUntilStartMs <= 60 * 60 * 1000 &&
		timeUntilStartMs >= 0;

	const canCancel =
		showCancel && !isCancelled && booking.status !== "COMPLETED";
	const canRepay =
		!isCancelled &&
		booking.paymentType === "STRIPE" &&
		booking.paymentStatus !== "COMPLETED" &&
		timeUntilStartMs >= 0;

	return (
		<div className="group flex flex-col gap-4 rounded-2xl border border-zinc-200/70 bg-white/70 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/40 p-5 sm:flex-row sm:items-center sm:justify-between transition-all hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm hover:shadow-md">
			<div className="flex gap-4">
				<div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
					{isCancelled ? (
						<XCircle className="h-6 w-6" />
					) : (
						<Video className="h-6 w-6" />
					)}
				</div>
				<div className="space-y-1.5 min-w-0">
					<div className="flex items-center gap-2">
						<Link
							to="/mentors/$mentorId"
							params={{ mentorId: booking.mentorId }}
							className="text-base font-bold text-zinc-900 dark:text-zinc-50 hover:text-primary transition-colors truncate"
						>
							{booking.mentorName || "Mentor Profile"}
						</Link>
						{isCancelled && (
							<Badge
								variant="destructive"
								className="h-5 text-[10px] px-2 rounded-full uppercase tracking-wider"
							>
								Cancelled
							</Badge>
						)}
						{booking.status === "PENDING" && (
							<Badge
								variant="secondary"
								className="h-5 text-[10px] px-2 rounded-full uppercase tracking-wider"
							>
								Payment Pending
							</Badge>
						)}
					</div>

					<div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
						<div className="flex items-center gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
							<Calendar className="h-4 w-4 text-primary/70" />
							{formatDate(booking.startTime)}
						</div>
						<div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
							<Clock className="h-3.5 w-3.5" />
							{formatTime(booking.startTime)} - {formatTime(booking.endTime)}
						</div>
					</div>

					<div className="flex items-center gap-3">
						<span className="flex items-center gap-1 text-xs font-semibold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900/50 px-2 py-0.5 rounded-md">
							{booking.paymentType === "COINS" ? (
								<Coins className="h-3 w-3 text-amber-500" />
							) : (
								<CreditCard className="h-3 w-3 text-blue-500" />
							)}
							{booking.totalAmount}{" "}
							{booking.currency === "inr" ? "₹" : booking.currency}
						</span>
						{showMeetingInfo && booking.meetingLink && (
							<a
								href={booking.meetingLink}
								target="_blank"
								rel="noreferrer"
								className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
							>
								<Video className="h-3.5 w-3.5" />
								<span>Join Session</span>
							</a>
						)}
					</div>
				</div>
			</div>

			<div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
				<Button
					asChild
					variant="outline"
					size="sm"
					className="h-9 px-4 rounded-xl text-xs font-semibold"
				>
					<button type="button" onClick={onViewDetails}>
						View details
					</button>
				</Button>

				{isCancelled && booking.notes && (
					<div className="hidden lg:block text-[10px] text-zinc-500 text-right max-w-[200px] line-clamp-1 italic">
						"{booking.notes}"
					</div>
				)}

				{canRepay && (
					<Button
						variant="default"
						size="sm"
						onClick={onRepay}
						disabled={isRepaying}
						className="h-9 px-4 rounded-xl text-xs font-semibold"
					>
						Pay now
					</Button>
				)}

				{canCancel && (
					<Button
						variant="ghost"
						size="sm"
						onClick={onCancel}
						disabled={isCancelling}
						className="h-9 px-4 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors border border-rose-100 dark:border-rose-900/30"
					>
						<XCircle className="h-3.5 w-3.5 mr-2" />
						Cancel Session
					</Button>
				)}
			</div>
		</div>
	);
}

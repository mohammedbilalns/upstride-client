import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import {
	Calendar,
	Clock,
	Video,
	XCircle,
	History,
	CreditCard,
	Coins,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { sessionBookingService } from "@/features/session-booking-management";
import type {
	BookingDto,
	BookingFilter,
} from "@/features/session-booking-management/types";
import { useCoinBalance } from "@/features/coin-management/hooks/use-coin-management";
import { Pagination } from "@/features/user-management/components/Pagination";
import { Route } from "@/routes/_app-layout/_user-layout/sessions/index";
import { useUserSessions } from "../hooks/use-sessions";
import { SessionFilters } from "../components/SessionFilters";

const formatDate = (value: string) => format(new Date(value), "MMM dd, yyyy");
const formatTime = (value: string) => format(new Date(value), "hh:mm a");
const formatBookedDate = (value: string) =>
	format(new Date(value), "MMM dd, yyyy");
const DAY_MS = 24 * 60 * 60 * 1000;

const getRefundPreview = (
	booking: BookingDto | undefined,
	coinValue?: number,
) => {
	if (!booking || booking.paymentStatus !== "COMPLETED") {
		return {
			percentage: 0,
			amount: 0,
			reason: "Payment not completed. No refund applicable.",
		};
	}

	const diffMs = new Date(booking.startTime).getTime() - Date.now();
	if (!Number.isFinite(diffMs) || diffMs <= 0 || diffMs <= DAY_MS) {
		return {
			percentage: 0,
			amount: 0,
			reason: "No refund within 24 hours of the session start time.",
		};
	}

	const percentage = diffMs <= 3 * DAY_MS ? 50 : 75;
	const baseCoins =
		booking.paymentType === "COINS"
			? booking.totalAmount
			: coinValue
				? booking.totalAmount * coinValue
				: null;
	const amount =
		baseCoins !== null ? Math.round((baseCoins * percentage) / 100) : null;

	return {
		percentage,
		amount,
		reason:
			percentage === 50
				? "Refunded 50% (within 3 days of the session)."
				: "Refunded 75% (more than 3 days before the session).",
	};
};

export function SessionsPage() {
	const navigate = useNavigate({ from: Route.fullPath });
	const queryClient = useQueryClient();
	const search = Route.useSearch();
	const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);
	const [cancelReason, setCancelReason] = useState("");
	const [pendingRepayId, setPendingRepayId] = useState<string | null>(null);
	const [selectedBooking, setSelectedBooking] = useState<BookingDto | null>(
		null,
	);
	const coinBalanceQuery = useCoinBalance();
	const coinValue = coinBalanceQuery.data?.coinValue;

	const filter = (
		search.tab === "past" ? "past" : search.upcomingFilter
	) as BookingFilter;
	const params = useMemo(
		() => ({
			page: search.page,
			limit: search.limit,
			filter,
		}),
		[filter, search.limit, search.page],
	);

	const { data, isLoading } = useUserSessions(params);
	const cancelMutation = useMutation({
		mutationFn: (bookingId: string) =>
			sessionBookingService.cancelBooking({ bookingId, reason: cancelReason }),
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: ["sessions", "user"] });
			queryClient.invalidateQueries({ queryKey: ["wallet", "balance"] });
			setPendingCancelId(null);
			setCancelReason("");
			const refund = response.data.refund;
			if (refund) {
				if (refund.amount > 0) {
					toast.success(
						`Refund amount: ${refund.amount} coins (${refund.percentage}%).`,
					);
				} else {
					toast.info(refund.reason);
				}
			}
		},
		onError: (error: any) => {
			setPendingCancelId(null);
			setCancelReason("");
			toast.error(
				error?.response?.data?.message || "Failed to cancel session booking.",
			);
		},
	});
	const repayMutation = useMutation({
		mutationFn: (bookingId: string) =>
			sessionBookingService.repayBooking(bookingId),
		onSuccess: (response) => {
			if (response.data.paymentUrl) {
				window.location.href = response.data.paymentUrl;
				return;
			}
			navigate({
				to: "/bookings/success",
				search: { id: response.data.bookingId },
			});
		},
		onSettled: () => {
			setPendingRepayId(null);
		},
	});

	const updateSearch = (updates: Partial<typeof search>) => {
		navigate({
			search: (prev) => ({
				...prev,
				...updates,
			}),
		});
	};

	const handlePageChange = (page: number) => updateSearch({ page });
	const handleLimitChange = (limit: number) => updateSearch({ limit, page: 1 });

	const bookings = data?.data.items ?? [];
	const total = data?.data.total ?? 0;
	const isDetailsOpen = Boolean(selectedBooking);
	const pendingCancelBooking = bookings.find(
		(booking) => booking.id === pendingCancelId,
	);
	const refundPreview = getRefundPreview(pendingCancelBooking, coinValue);

	return (
		<div className="relative">
			<div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-zinc-50 to-transparent dark:from-zinc-950 dark:to-transparent" />
			<div className="container mx-auto px-4 md:px-6 py-8 flex flex-col min-h-screen gap-6 relative">
				<div className="flex flex-col gap-1">
					<h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
						My Sessions
					</h1>
					<p className="text-sm text-muted-foreground">
						Manage your upcoming and past mentoring sessions.
					</p>
				</div>

				<div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
					<aside className="lg:w-[300px] shrink-0">
						<div className="lg:sticky top-6">
							<SessionFilters
								search={search}
								onUpdate={updateSearch}
								onClear={() =>
									navigate({
										search: {
											tab: "upcoming",
											upcomingFilter: "upcoming",
											page: 1,
											limit: 10,
										},
									})
								}
							/>
						</div>
					</aside>

					<section className="flex-1 min-w-0 space-y-4">
						<div className="rounded-2xl border border-zinc-200/70 bg-white/70 backdrop-blur-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950/40 px-4 py-3">
							<div>
								<p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
									Sessions
								</p>
								{!isLoading && (
									<p className="text-xs text-zinc-500">
										Showing{" "}
										<span className="font-medium text-zinc-700 dark:text-zinc-300">
											{bookings.length}
										</span>{" "}
										of{" "}
										<span className="font-medium text-zinc-700 dark:text-zinc-300">
											{total}
										</span>{" "}
										sessions
									</p>
								)}
							</div>
						</div>

						<div className="min-w-0 space-y-4">
							{isLoading && (
								<div className="space-y-4">
									{[1, 2, 3].map((i) => (
										<div
											key={i}
											className="h-32 rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse"
										/>
									))}
								</div>
							)}

							{!isLoading && bookings.length === 0 && (
								<div className="flex flex-col items-center justify-center py-20 text-center bg-white/40 dark:bg-zinc-950/20 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800">
									<div className="h-16 w-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-4 text-zinc-400">
										{search.tab === "past" ? (
											<History className="h-8 w-8" />
										) : (
											<Calendar className="h-8 w-8" />
										)}
									</div>
									<h3 className="text-base font-medium text-zinc-800 dark:text-zinc-200 mb-1">
										No {search.tab === "past" ? "past" : "upcoming"} sessions
										found
									</h3>
									<p className="text-sm text-zinc-500 max-w-xs">
										{search.tab === "past"
											? "You haven't completed any sessions yet. Book a session with a mentor to get started!"
											: "You don't have any scheduled sessions for this period."}
									</p>
								</div>
							)}

							<div className="grid gap-4">
								{bookings.map((booking) => (
									<SessionCard
										key={booking.id}
										booking={booking}
										showCancel={search.tab === "upcoming"}
										onViewDetails={() => setSelectedBooking(booking)}
										onCancel={() => setPendingCancelId(booking.id)}
										onRepay={() => setPendingRepayId(booking.id)}
										isCancelling={cancelMutation.isPending}
										isRepaying={repayMutation.isPending}
									/>
								))}
							</div>

							{data?.data && data.data.totalPages > 1 && (
								<div className="mt-8 pb-8">
									<Pagination
										currentPage={data.data.page}
										totalPages={data.data.totalPages}
										totalItems={data.data.total}
										limit={data.data.limit}
										onPageChange={handlePageChange}
										onLimitChange={handleLimitChange}
									/>
								</div>
							)}
						</div>
					</section>
				</div>
			</div>

			<Dialog
				open={isDetailsOpen}
				onOpenChange={(open) => {
					if (!open) setSelectedBooking(null);
				}}
			>
				<DialogContent className="sm:max-w-[560px]">
					<DialogHeader>
						<DialogTitle>Session Details</DialogTitle>
						<DialogDescription>
							Review the details for this session.
						</DialogDescription>
					</DialogHeader>

					{selectedBooking && (
						<div className="space-y-4 text-sm">
							<div className="space-y-1">
								<p className="text-xs uppercase tracking-wide text-muted-foreground">
									Mentor
								</p>
								<p className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
									{selectedBooking.mentorName || "Mentor"}
								</p>
							</div>

							<div className="grid gap-3 sm:grid-cols-2">
								<div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800 p-3">
									<p className="text-xs uppercase tracking-wide text-muted-foreground">
										Session Date
									</p>
									<p className="mt-1 font-medium">
										{formatDate(selectedBooking.startTime)}
									</p>
									<p className="text-xs text-muted-foreground">
										{formatTime(selectedBooking.startTime)} -{" "}
										{formatTime(selectedBooking.endTime)}
									</p>
								</div>
								<div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800 p-3">
									<p className="text-xs uppercase tracking-wide text-muted-foreground">
										Booked On
									</p>
									<p className="mt-1 font-medium">
										{formatBookedDate(selectedBooking.createdAt)}
									</p>
								</div>
							</div>

							<div className="flex flex-wrap items-center gap-2">
								<Badge variant="outline" className="text-[10px] uppercase">
									{selectedBooking.status}
								</Badge>
								<Badge variant="secondary" className="text-[10px] uppercase">
									{selectedBooking.paymentStatus}
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

			<ConfirmModal
				isOpen={Boolean(pendingCancelId)}
				onClose={() => setPendingCancelId(null)}
				onConfirm={() => {
					if (!cancelReason.trim()) return;
					if (pendingCancelId) cancelMutation.mutate(pendingCancelId);
				}}
				title="Cancel session"
				message="Confirm cancellation for this session."
				confirmText="Confirm Cancel"
				variant="destructive"
				isLoading={cancelMutation.isPending}
			>
				<div className="mt-4 space-y-3">
					<div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 p-3 text-xs text-zinc-600 dark:text-zinc-300">
						<p className="font-semibold text-zinc-800 dark:text-zinc-100">
							Refund preview
						</p>
						{refundPreview.amount !== null ? (
							<p className="mt-1">
								Refund amount: {refundPreview.amount} coins (
								{refundPreview.percentage}%).
							</p>
						) : (
							<p className="mt-1">
								Refund amount: {refundPreview.percentage}% (coin value
								unavailable).
							</p>
						)}
						<p className="mt-1 text-zinc-500 dark:text-zinc-400">
							{refundPreview.reason}
						</p>
					</div>
					<label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
						Cancellation reason
					</label>
					<Textarea
						value={cancelReason}
						onChange={(e) => setCancelReason(e.target.value)}
						placeholder="Please share why you're cancelling..."
						className="min-h-[100px] rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 resize-none focus:ring-primary/20"
					/>
				</div>
			</ConfirmModal>

			<ConfirmModal
				isOpen={Boolean(pendingRepayId)}
				onClose={() => setPendingRepayId(null)}
				onConfirm={() => {
					if (pendingRepayId) repayMutation.mutate(pendingRepayId);
				}}
				title="Retry payment"
				message="This session payment is still pending. Continue to complete the payment?"
				confirmText="Pay now"
				isLoading={repayMutation.isPending}
			/>
		</div>
	);
}

function SessionCard({
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

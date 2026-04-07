import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { Calendar, History } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ConfirmModal } from "@/components/common/ConfirmModal";
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
import { SessionCard } from "../components/SessionCard";
import { CancelSessionDialog } from "../components/CancelSessionDialog";
import { SessionDetailsDialog } from "../components/SessionDetailsDialog";

// const formatDate = (value: string) => format(new Date(value), "MMM dd, yyyy");
// const formatTime = (value: string) => format(new Date(value), "hh:mm a");
// const formatBookedDate = (value: string) =>
// 	format(new Date(value), "MMM dd, yyyy");
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
				to: "/sessions",
				search: (prev: any) => ({
					...prev,
					booking_success: true,
					booking_id: response.data.bookingId,
				}),
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

			<SessionDetailsDialog
				isOpen={isDetailsOpen}
				onClose={(open) => {
					if (!open) setSelectedBooking(null);
				}}
				selectedBooking={selectedBooking}
			/>

			<CancelSessionDialog
				isOpen={Boolean(pendingCancelId)}
				onClose={() => setPendingCancelId(null)}
				onConfirm={() => {
					if (pendingCancelId) cancelMutation.mutate(pendingCancelId);
				}}
				cancelReason={cancelReason}
				setCancelReason={setCancelReason}
				refundPreview={refundPreview}
				isCancelling={cancelMutation.isPending}
			/>

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

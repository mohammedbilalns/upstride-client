import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
	ArrowUpDown,
	Calendar,
	Clock,
	Coins,
	CreditCard,
	Star,
	Video,
	XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { sessionBookingService } from "@/features/session-booking";
import type { Booking } from "@/features/session-booking/types";
import { SessionDetailsDialog } from "@/features/sessions/components/SessionDetailsDialog";
import { Pagination } from "@/features/users/components/Pagination";
import { Route } from "@/routes/_app-layout/_mentor-layout/mentor-sessions";
import { cn } from "@/shared/utils/cn";
import { formatDateShort, formatTimeShort } from "@/shared/utils/date";
import { useMentorSessions } from "../hooks/queries/useMentorSessions";

type MentorSort = "soonest" | "latest";

const filterOptions = [
	{ value: "upcoming", label: "Upcoming" },
	{ value: "past", label: "Past" },
	{ value: "cancelled", label: "Cancelled" },
] as const;

export function MentorSessionsPage() {
	const navigate = useNavigate({ from: Route.fullPath });
	const queryClient = useQueryClient();
	const search = Route.useSearch();
	const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);
	const [cancelReason, setCancelReason] = useState("");
	const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
	const [sortBy, setSortBy] = useState<MentorSort>("soonest");

	const params = useMemo(
		() => ({
			page: search.page,
			limit: search.limit,
			filter: search.filter,
		}),
		[search.filter, search.limit, search.page],
	);

	const { data, isLoading } = useMentorSessions(params);
	const sessions = data?.data.items ?? [];

	const visibleSessions = useMemo(() => {
		return [...sessions].sort((a, b) => {
			const timeA = new Date(a.startTime).getTime();
			const timeB = new Date(b.startTime).getTime();
			return sortBy === "soonest" ? timeA - timeB : timeB - timeA;
		});
	}, [sessions, sortBy]);

	const cancelMutation = useMutation({
		mutationFn: (bookingId: string) =>
			sessionBookingService.cancelBookingByMentor({
				bookingId,
				reason: cancelReason,
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["sessions", "mentor"] });
			queryClient.invalidateQueries({ queryKey: ["wallet", "balance"] });
			setPendingCancelId(null);
			setCancelReason("");
		},
		onError: () => {
			setPendingCancelId(null);
			setCancelReason("");
		},
	});

	const handlePageChange = (page: number) => {
		navigate({
			search: (prev) => ({
				...prev,
				page,
			}),
		});
	};

	const handleLimitChange = (limit: number) => {
		navigate({
			search: (prev) => ({
				...prev,
				limit,
				page: 1,
			}),
		});
	};

	const handleFilterChange = (value: string) => {
		navigate({
			search: (prev) => ({
				...prev,
				filter: value as "upcoming" | "past" | "cancelled",
				page: 1,
			}),
		});
	};

	return (
		<div className="p-4 md:p-6 space-y-6 max-w-[90rem] mx-auto animate-in fade-in duration-500">
			<Card className="border-border/60 shadow-sm">
				<CardHeader className="space-y-5">
					<div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
						<div className="space-y-1">
							<CardTitle className="text-2xl">Mentoring Sessions</CardTitle>
							<p className="text-sm text-muted-foreground">
								Sessions booked by mentees for your guidance.
							</p>
						</div>
					</div>

					<div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
						<div className="space-y-2">
							<p className="text-xs font-semibold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">
								Quick filters
							</p>
							<div className="flex flex-wrap gap-2">
								{filterOptions.map((option) => {
									const active = search.filter === option.value;
									return (
										<button
											key={option.value}
											type="button"
											onClick={() => handleFilterChange(option.value)}
											className={cn(
												"rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
												active
													? "border-primary bg-primary/10 text-primary"
													: "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950/20 dark:text-zinc-300 dark:hover:text-zinc-50",
											)}
										>
											{option.label}
										</button>
									);
								})}
							</div>
						</div>

						<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
							<Select
								value={sortBy}
								onValueChange={(value) => setSortBy(value as MentorSort)}
							>
								<SelectTrigger className="h-10 w-full sm:w-44 rounded-xl">
									<ArrowUpDown className="mr-2 h-4 w-4 text-muted-foreground" />
									<SelectValue placeholder="Sort" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="soonest">Soonest first</SelectItem>
									<SelectItem value="latest">Latest first</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardHeader>

				<CardContent className="space-y-4">
					{isLoading && (
						<p className="text-sm text-muted-foreground">Loading sessions...</p>
					)}

					{!isLoading && visibleSessions.length === 0 && (
						<div className="border border-dashed border-border/60 rounded-xl p-8 text-center text-sm text-muted-foreground">
							No sessions found for this filter.
						</div>
					)}

					<div className="grid gap-3">
						{visibleSessions.map((session) => (
							<MentorSessionCard
								key={session.id}
								booking={session}
								showCancel={search.filter === "upcoming"}
								onCancel={() => setPendingCancelId(session.id)}
								onViewDetails={() => setSelectedBooking(session)}
								isCancelling={cancelMutation.isPending}
							/>
						))}
					</div>

					{data?.data && data.data.totalPages > 1 && (
						<Pagination
							currentPage={data.data.page}
							totalPages={data.data.totalPages}
							totalItems={data.data.total}
							limit={data.data.limit}
							onPageChange={handlePageChange}
							onLimitChange={handleLimitChange}
						/>
					)}
				</CardContent>
			</Card>

			<ConfirmModal
				isOpen={Boolean(pendingCancelId)}
				onClose={() => setPendingCancelId(null)}
				onConfirm={() => {
					if (!cancelReason.trim()) {
						return;
					}
					if (pendingCancelId) {
						cancelMutation.mutate(pendingCancelId);
					}
				}}
				title="Cancel session"
				message="Confirm cancellation for this mentoring session."
				confirmText="Confirm Cancel"
				variant="destructive"
				isLoading={cancelMutation.isPending}
			>
				<div className="mt-4 space-y-2">
					<label htmlFor="mentor-cancel-reason" className="text-sm font-medium">
						Cancellation reason
					</label>
					<Textarea
						id="mentor-cancel-reason"
						value={cancelReason}
						onChange={(e) => setCancelReason(e.target.value)}
						placeholder="Share why you're cancelling..."
						className="min-h-[100px] resize-none"
					/>
				</div>
			</ConfirmModal>

			<SessionDetailsDialog
				isOpen={Boolean(selectedBooking)}
				onClose={(open) => {
					if (!open) setSelectedBooking(null);
				}}
				selectedBooking={selectedBooking}
				personLabel="Mentee"
				personName={selectedBooking?.menteeName}
				showReceipt={false}
				canSubmitReview={false}
			/>
		</div>
	);
}

function MentorSessionCard({
	booking,
	showCancel,
	onCancel,
	onViewDetails,
	isCancelling,
}: {
	booking: Booking;
	showCancel: boolean;
	onCancel: () => void;
	onViewDetails: () => void;
	isCancelling: boolean;
}) {
	const isCancelled = booking.status.startsWith("CANCELLED");
	const isSlotTakenByAnotherUser =
		booking.status === "SLOT_TAKEN_BY_ANOTHER_USER";
	const now = Date.now();
	const timeUntilStartMs = new Date(booking.startTime).getTime() - now;
	const hasEnded = new Date(booking.endTime).getTime() < now;
	const showJoinButton =
		!isCancelled &&
		!isSlotTakenByAnotherUser &&
		!hasEnded &&
		booking.status !== "COMPLETED" &&
		booking.status !== "PENDING" &&
		timeUntilStartMs <= 60 * 60 * 1000 &&
		timeUntilStartMs >= -(120 * 60 * 1000);

	const canCancel =
		showCancel &&
		!isCancelled &&
		!isSlotTakenByAnotherUser &&
		booking.status !== "COMPLETED";

	return (
		<div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/40 p-4 sm:flex-row sm:items-center sm:justify-between hover:border-border transition-colors">
			<div className="space-y-2 flex-1 min-w-0">
				<div className="flex items-center gap-3 flex-wrap">
					<div className="flex items-center gap-2 text-sm font-semibold min-w-0">
						<Calendar className="h-4 w-4 text-primary" />
						<span className="truncate">
							{formatDateShort(booking.startTime)}
						</span>
					</div>
					{isCancelled && <Badge variant="destructive">Cancelled</Badge>}
					{isSlotTakenByAnotherUser && (
						<Badge
							variant="destructive"
							className="bg-amber-500 text-white hover:bg-amber-500"
						>
							Slot taken
						</Badge>
					)}
					{booking.status === "PENDING" && (
						<Badge variant="secondary">Payment Pending</Badge>
					)}
					{booking.status === "STARTED" && (
						<Badge className="bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-1.5 animate-pulse border-none">
							<span className="h-1.5 w-1.5 rounded-full bg-white" />
							Ongoing
						</Badge>
					)}
				</div>
				<div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
					<div className="flex items-center gap-2">
						<Clock className="h-4 w-4" />
						{formatTimeShort(booking.startTime)} -{" "}
						{formatTimeShort(booking.endTime)}
					</div>
					<div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800/50 px-2 py-0.5 rounded text-xs">
						{booking.paymentType === "COINS" ? (
							<Coins className="h-3 w-3 text-amber-500" />
						) : (
							<CreditCard className="h-3 w-3 text-blue-500" />
						)}
						{booking.totalAmount} {booking.currency.toUpperCase()}
					</div>
					{booking.review && (
						<div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded text-xs text-zinc-700 dark:text-zinc-300">
							<Star className="h-3 w-3 fill-current text-amber-500" />
							{booking.review.rating}/5
						</div>
					)}
					{showJoinButton && (
						<Link
							to="/call/$bookingId"
							params={{ bookingId: booking.id }}
							className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
						>
							<Video className="h-3.5 w-3.5" />
							<span>Join Session</span>
						</Link>
					)}
				</div>
			</div>

			<div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end sm:gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={onViewDetails}
					className="h-9 px-4 rounded-xl text-xs font-semibold"
				>
					View details
				</Button>

				{isCancelled && booking.notes && (
					<div className="hidden lg:block text-[10px] text-zinc-500 text-right max-w-[220px] line-clamp-1 italic">
						"{booking.notes}"
					</div>
				)}

				{canCancel && (
					<Button
						variant="outline"
						size="sm"
						onClick={onCancel}
						disabled={isCancelling}
						className="h-9 px-4 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-100 dark:border-rose-900/30"
					>
						<XCircle className="h-3.5 w-3.5 mr-2" />
						Cancel
					</Button>
				)}
			</div>
		</div>
	);
}

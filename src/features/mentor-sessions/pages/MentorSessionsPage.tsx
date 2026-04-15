import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
	Calendar,
	Clock,
	Coins,
	CreditCard,
	Download,
	Video,
	XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { sessionBookingService } from "@/features/session-booking-management";
import type { BookingDto } from "@/features/session-booking-management/types";
import { SessionDetailsDialog } from "@/features/sessions/components/SessionDetailsDialog";
import { Pagination } from "@/features/user-management/components/Pagination";
import { Route } from "@/routes/_app-layout/_mentor-layout/mentor-sessions";
import { formatDateShort, formatTimeShort } from "@/shared/utils/date";
import { useMentorSessions } from "../hooks/use-mentor-sessions";

export function MentorSessionsPage() {
	const navigate = useNavigate({ from: Route.fullPath });
	const queryClient = useQueryClient();
	const search = Route.useSearch();
	const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);
	const [cancelReason, setCancelReason] = useState("");
	const [selectedBooking, setSelectedBooking] = useState<BookingDto | null>(
		null,
	);

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
				<CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<CardTitle className="text-2xl">Mentoring Sessions</CardTitle>
					<div className="flex items-center gap-3">
						<span className="text-sm text-muted-foreground">Show</span>
						<Select value={search.filter} onValueChange={handleFilterChange}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Upcoming" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="upcoming">Upcoming</SelectItem>
								<SelectItem value="past">Past</SelectItem>
								<SelectItem value="cancelled">Cancelled</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardHeader>
				<CardContent className="space-y-2">
					<p className="text-sm text-muted-foreground">
						Sessions booked by mentees for your guidance.
					</p>
				</CardContent>
				<CardContent className="space-y-4">
					{isLoading && (
						<p className="text-sm text-muted-foreground">Loading sessions...</p>
					)}

					{!isLoading && sessions.length === 0 && (
						<div className="border border-dashed border-border/60 rounded-xl p-8 text-center text-sm text-muted-foreground">
							No sessions found for this filter.
						</div>
					)}

					<div className="grid gap-3">
						{sessions.map((session) => (
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
	booking: BookingDto;
	showCancel: boolean;
	onCancel: () => void;
	onViewDetails: () => void;
	isCancelling: boolean;
}) {
	const isCancelled = booking.status.startsWith("CANCELLED");
	const now = Date.now();
	const timeUntilStartMs = new Date(booking.startTime).getTime() - now;
	const hasEnded = new Date(booking.endTime).getTime() < now;
	const showJoinButton =
		!isCancelled &&
		!hasEnded &&
		booking.status !== "COMPLETED" &&
		timeUntilStartMs <= 60 * 60 * 1000 && // 1 hour before
		timeUntilStartMs >= -(120 * 60 * 1000); // Keep late joins blocked once the session is already past

	const canCancel =
		showCancel && !isCancelled && booking.status !== "COMPLETED";

	const canDownloadReceipt =
		!isCancelled &&
		booking.paymentType === "STRIPE" &&
		booking.paymentStatus === "COMPLETED" &&
		["CONFIRMED", "STARTED", "COMPLETED"].includes(booking.status);

	return (
		<div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/40 p-4 sm:flex-row sm:items-center sm:justify-between hover:border-border transition-colors">
			<div className="space-y-2 flex-1">
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-2 text-sm font-semibold">
						<Calendar className="h-4 w-4 text-primary" />
						{formatDateShort(booking.startTime)}
					</div>
					{isCancelled && <Badge variant="destructive">Cancelled</Badge>}
					{booking.status === "PENDING" && (
						<Badge variant="secondary">Payment Pending</Badge>
					)}
					{booking.status === "STARTED" && (
						<Badge className="bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-1.5 animate-pulse">
							<span className="h-1.5 w-1.5 rounded-full bg-white transition-opacity" />
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
				</div>
			</div>
			<div className="flex items-center gap-3">
				{isCancelled && booking.notes && (
					<div className="text-xs text-muted-foreground italic max-w-[200px] truncate">
						"{booking.notes}"
					</div>
				)}
				{showJoinButton && (
					<Link
						to="/call/$bookingId"
						params={{ bookingId: booking.id }}
						className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline bg-primary/5 px-2 py-1 rounded-md"
					>
						<Video className="h-4 w-4" />
						<span>Join Session</span>
					</Link>
				)}
				<Button
					variant="ghost"
					size="sm"
					onClick={onViewDetails}
					className="text-xs"
				>
					View details
				</Button>
				{canDownloadReceipt && (
					<Button
						variant="outline"
						size="sm"
						onClick={() => sessionBookingService.downloadReceipt(booking.id)}
						className="text-xs"
					>
						<Download className="h-3.5 w-3.5 mr-1.5" />
						Download Receipt
					</Button>
				)}
				{canCancel && (
					<Button
						variant="outline"
						size="sm"
						onClick={onCancel}
						disabled={isCancelling}
						className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-100 dark:border-rose-900/30"
					>
						<XCircle className="h-4 w-4 mr-2" />
						Cancel
					</Button>
				)}
			</div>
		</div>
	);
}

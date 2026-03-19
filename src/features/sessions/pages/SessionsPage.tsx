import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { sessionBookingService } from "@/features/session-booking-management";
import type { BookingListItem } from "@/features/session-booking-management/types";
import { Pagination } from "@/features/user-management/components/Pagination";
import { Route } from "@/routes/_user-layout/sessions";
import { useUserSessions } from "../hooks/use-sessions";

const formatDate = (value: string) => format(new Date(value), "MMM dd, yyyy");
const formatTime = (value: string) => format(new Date(value), "hh:mm a");

export function SessionsPage() {
	const navigate = useNavigate({ from: Route.fullPath });
	const queryClient = useQueryClient();
	const search = Route.useSearch();
	const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);
	const [cancelReason, setCancelReason] = useState("");

	const filter = search.tab === "past" ? "past" : search.upcomingFilter;
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
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["sessions", "user"] });
			queryClient.invalidateQueries({ queryKey: ["wallet", "balance"] });
			setPendingCancelId(null);
			setCancelReason("");
		},
		onError: () => {
			setPendingCancelId(null);
			setCancelReason("");
		},
	});

	const handleTabChange = (value: string) => {
		navigate({
			search: (prev: any) => ({
				...prev,
				tab: value as "upcoming" | "past",
				page: 1,
			}),
		});
	};

	const handleUpcomingFilterChange = (value: string) => {
		navigate({
			search: (prev: any) => ({
				...prev,
				upcomingFilter: value as "upcoming" | "cancelled",
				page: 1,
			}),
		});
	};

	const handlePageChange = (page: number) => {
		navigate({
			search: (prev: any) => ({
				...prev,
				page,
			}),
		});
	};

	const handleLimitChange = (limit: number) => {
		navigate({
			search: (prev: any) => ({
				...prev,
				limit,
				page: 1,
			}),
		});
	};

	const bookings = data?.data.items ?? [];

	return (
		<div className="p-4 md:p-6 space-y-6 max-w-[90rem] mx-auto animate-in fade-in duration-500">
			<Card className="border-border/60 shadow-sm">
				<CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div>
						<CardTitle className="text-2xl">Sessions</CardTitle>
						<p className="text-sm text-muted-foreground">
							Track your upcoming and past sessions.
						</p>
					</div>
					<Tabs value={search.tab} onValueChange={handleTabChange}>
						<TabsList>
							<TabsTrigger value="upcoming">Upcoming</TabsTrigger>
							<TabsTrigger value="past">Past</TabsTrigger>
						</TabsList>
					</Tabs>
				</CardHeader>
				<CardContent className="space-y-4">
					{search.tab === "upcoming" && (
						<div className="flex items-center gap-3">
							<span className="text-sm text-muted-foreground">Show</span>
							<Select
								value={search.upcomingFilter}
								onValueChange={handleUpcomingFilterChange}
							>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Upcoming" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="upcoming">Upcoming</SelectItem>
									<SelectItem value="cancelled">Cancelled</SelectItem>
								</SelectContent>
							</Select>
						</div>
					)}

					{isLoading && (
						<p className="text-sm text-muted-foreground">Loading sessions...</p>
					)}

					{!isLoading && bookings.length === 0 && (
						<div className="border border-dashed border-border/60 rounded-xl p-8 text-center text-sm text-muted-foreground">
							No sessions found.
						</div>
					)}

					<div className="grid gap-3">
						{bookings.map((booking) => (
							<SessionCard
								key={booking.id}
								booking={booking}
								showCancel={search.tab === "upcoming"}
								onCancel={() => setPendingCancelId(booking.id)}
								isCancelling={cancelMutation.isPending}
							/>
						))}
					</div>

					{data?.data && (
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
				message="Cancelling more than 5 days before the session gives a full refund. Within 5 days, only 50% is refunded."
				confirmText="Confirm Cancel"
				variant="destructive"
				isLoading={cancelMutation.isPending}
			>
				<div className="mt-4 space-y-2">
					<label className="text-sm font-medium">Cancellation reason</label>
					<Textarea
						value={cancelReason}
						onChange={(e) => setCancelReason(e.target.value)}
						placeholder="Share a short reason..."
					/>
				</div>
			</ConfirmModal>
		</div>
	);
}

function SessionCard({
	booking,
	showCancel,
	onCancel,
	isCancelling,
}: {
	booking: BookingListItem;
	showCancel: boolean;
	onCancel: () => void;
	isCancelling: boolean;
}) {
	const timeUntilStartMs = new Date(booking.startTime).getTime() - Date.now();
	const showMeetingInfo =
		showCancel && timeUntilStartMs <= 60 * 60 * 1000 && timeUntilStartMs >= 0;

	const statusLabel = booking.status === "cancelled" ? "Cancelled" : null;

	const canCancel =
		showCancel &&
		(booking.status === "confirmed" || booking.status === "pending");

	return (
		<div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/40 p-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="space-y-2">
				<div className="text-sm font-semibold">
					<Link
						to="/mentors/$mentorId"
						params={{ mentorId: booking.mentorId }}
						className="text-primary hover:underline"
					>
						{booking.mentorName ?? "Mentor"}
					</Link>
				</div>
				<div className="flex items-center gap-2 text-sm font-semibold">
					<Calendar className="h-4 w-4 text-primary" />
					{formatDate(booking.startTime)}
				</div>
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Clock className="h-4 w-4" />
					{formatTime(booking.startTime)} - {formatTime(booking.endTime)}
				</div>
				<div className="text-xs text-muted-foreground">
					Price: {booking.price} coins
				</div>
				{showMeetingInfo && booking.meetingId && (
					<div className="text-xs text-muted-foreground">
						Meeting ID: {booking.meetingId}
					</div>
				)}
			</div>
			<div className="flex items-center gap-3">
				{statusLabel && (
					<Badge variant="destructive">
						<span className="flex items-center gap-1.5">
							<span className="h-1.5 w-1.5 rounded-full bg-current" />
							{statusLabel}
						</span>
					</Badge>
				)}
				{booking.attendanceStatus && (
					<Badge
						variant={
							booking.attendanceStatus === "attended" ? "default" : "secondary"
						}
					>
						{booking.attendanceStatus === "attended"
							? "Attended"
							: "Not Attended"}
					</Badge>
				)}
				{booking.status === "cancelled" && booking.cancellationReason && (
					<div className="text-xs text-muted-foreground">
						Cancelled by {booking.cancelledBy ?? "user"}:{" "}
						<span className="text-foreground">
							{booking.cancellationReason}
						</span>
					</div>
				)}
				{canCancel && (
					<Button
						variant="outline"
						size="sm"
						onClick={onCancel}
						disabled={isCancelling}
					>
						Cancel
					</Button>
				)}
			</div>
		</div>
	);
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
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
import { Textarea } from "@/components/ui/textarea";
import { sessionBookingService } from "@/features/session-booking-management";
import type { BookingListItem } from "@/features/session-booking-management/types";
import { Pagination } from "@/features/user-management/components/Pagination";
import { Route } from "@/routes/_mentor-layout/mentor-sessions";
import { useMentorSessions } from "../hooks/use-mentor-sessions";

const formatDate = (value: string) => format(new Date(value), "MMM dd, yyyy");
const formatTime = (value: string) => format(new Date(value), "hh:mm a");

export function MentorSessionsPage() {
	const navigate = useNavigate({ from: Route.fullPath });
	const queryClient = useQueryClient();
	const search = Route.useSearch();
	const [pendingCancelId, setPendingCancelId] = useState<string | null>(null);
	const [cancelReason, setCancelReason] = useState("");

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

	const handleFilterChange = (value: string) => {
		navigate({
			search: (prev: any) => ({
				...prev,
				filter: value as "upcoming" | "cancelled",
				page: 1,
			}),
		});
	};

	return (
		<div className="p-4 md:p-6 space-y-6 max-w-[90rem] mx-auto animate-in fade-in duration-500">
			<Card className="border-border/60 shadow-sm">
				<CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<CardTitle className="text-2xl">Upcoming Sessions</CardTitle>
					<div className="flex items-center gap-3">
						<span className="text-sm text-muted-foreground">Show</span>
						<Select value={search.filter} onValueChange={handleFilterChange}>
							<SelectTrigger className="w-[180px]">
								<SelectValue placeholder="Upcoming" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="upcoming">Upcoming</SelectItem>
								<SelectItem value="cancelled">Cancelled</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardHeader>
				<CardContent className="space-y-2">
					<p className="text-sm text-muted-foreground">
						Sessions booked by other users or mentors.
					</p>
				</CardContent>
				<CardContent className="space-y-4">
					{isLoading && (
						<p className="text-sm text-muted-foreground">
							Loading upcoming sessions...
						</p>
					)}

					{!isLoading && sessions.length === 0 && (
						<div className="border border-dashed border-border/60 rounded-xl p-8 text-center text-sm text-muted-foreground">
							No upcoming sessions found.
						</div>
					)}

					<div className="grid gap-3">
						{sessions.map((session) => (
							<MentorSessionCard
								key={session.id}
								booking={session}
								showCancel={search.filter === "upcoming"}
								onCancel={() => setPendingCancelId(session.id)}
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
				message="Cancelling this session will refund the user fully."
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

function MentorSessionCard({
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
	const canCancel =
		showCancel &&
		(booking.status === "confirmed" || booking.status === "pending");

	return (
		<div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card/40 p-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="space-y-2">
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
			</div>
			<div className="flex items-center gap-3">
				{booking.status === "cancelled" && (
					<Badge variant="destructive">Cancelled</Badge>
				)}
				{booking.status === "cancelled" && booking.cancellationReason && (
					<div className="text-xs text-muted-foreground">
						Cancelled by {booking.cancelledBy ?? "mentor"}:{" "}
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

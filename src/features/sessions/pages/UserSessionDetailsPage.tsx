import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import type { ApiError } from "@/api/apiError";
import { reviewService } from "@/features/reviews";
import { sessionBookingService } from "@/features/session-booking";
import { Route } from "@/routes/_app-layout/_user-layout/sessions/$sessionId";
import { SessionDetailsDialog } from "../components/SessionDetailsDialog";
import { useSessionDetails } from "../hooks/queries/useSessionDetails";

export function UserSessionDetailsPage() {
	const navigate = useNavigate({ from: Route.fullPath });
	const { sessionId } = Route.useParams();
	const queryClient = useQueryClient();
	const { data, isLoading } = useSessionDetails(sessionId);
	const booking = data?.data.booking ?? null;

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
				search: {
					booking_success: true,
					booking_id: response.data.bookingId,
					tab: "upcoming",
					page: 1,
					limit: 10,
					filter: "upcoming",
				},
			});
		},
	});

	const reviewMutation = useMutation({
		mutationFn: (input: {
			bookingId: string;
			rating: number;
			comment: string;
		}) => reviewService.createReview(input),
		onSuccess: () => {
			if (booking) {
				queryClient.invalidateQueries({
					queryKey: ["sessions", "user"],
				});
				queryClient.invalidateQueries({
					queryKey: ["sessions", "details", booking.id],
				});
				queryClient.invalidateQueries({
					queryKey: ["public-mentor-profile", booking.mentorId],
				});
			}
			toast.success("Review submitted successfully.");
			navigate({
				to: "/sessions",
			});
		},
		onError: (error: ApiError) => {
			toast.error(error?.response?.data?.message || "Failed to submit review.");
		},
	});

	if (isLoading || !booking) {
		return (
			<div className="mx-auto max-w-5xl p-4 md:p-6">
				<div className="rounded-3xl border border-border/60 bg-card p-8 text-muted-foreground shadow-sm">
					Loading session details...
				</div>
			</div>
		);
	}

	const canSubmitReview = Boolean(
		booking.status === "COMPLETED" &&
			booking.paymentStatus === "COMPLETED" &&
			booking.settledAt &&
			!booking.review,
	);

	return (
		<SessionDetailsDialog
			isOpen
			onClose={() => undefined}
			selectedBooking={booking}
			personLabel="Mentor"
			personName={booking.mentorName}
			showReceipt
			mode="page"
			onBack={() =>
				navigate({
					to: "/sessions",
				})
			}
			backLabel="Back to sessions"
			onRepay={async () => {
				await repayMutation.mutateAsync(booking.id);
			}}
			canSubmitReview={canSubmitReview}
			onSubmitReview={async (input) => {
				await reviewMutation.mutateAsync({
					bookingId: booking.id,
					rating: input.rating,
					comment: input.comment,
				});
			}}
			isSubmittingReview={reviewMutation.isPending}
		/>
	);
}

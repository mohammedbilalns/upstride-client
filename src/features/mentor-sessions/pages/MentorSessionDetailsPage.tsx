import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import type { ApiError } from "@/api/apiError";
import { sessionBookingService } from "@/features/session-booking";
import { SessionDetailsDialog } from "@/features/sessions/components/SessionDetailsDialog";
import { useSessionDetails } from "@/features/sessions/hooks/queries/useSessionDetails";
import { Route } from "@/routes/_app-layout/_mentor-layout/mentor-sessions/$sessionId";

export function MentorSessionDetailsPage() {
	const navigate = useNavigate({ from: Route.fullPath });
	const { sessionId } = Route.useParams();
	const queryClient = useQueryClient();
	const { data, isLoading } = useSessionDetails(sessionId);
	const booking = data?.data.booking ?? null;

	const feedbackMutation = useMutation({
		mutationFn: (input: { bookingId: string; feedback: string }) =>
			sessionBookingService.createFeedback(input),
		onSuccess: () => {
			if (!booking) return;
			queryClient.invalidateQueries({ queryKey: ["sessions", "mentor"] });
			queryClient.invalidateQueries({
				queryKey: ["sessions", "details", booking.id],
			});
			toast.success("Feedback updated successfully.");
		},
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data?.message || "Failed to update feedback.",
			);
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

	return (
		<SessionDetailsDialog
			isOpen
			onClose={() => undefined}
			selectedBooking={booking}
			personLabel="Mentee"
			personName={booking.menteeName}
			payoutLabel="You Receive"
			reviewTitle="Mentee's Review"
			feedbackTitle="Your Feedback"
			showReceipt={false}
			canSubmitReview={false}
			canSubmitFeedback={booking.status === "COMPLETED"}
			onSubmitFeedback={async (input) => {
				await feedbackMutation.mutateAsync({
					bookingId: booking.id,
					feedback: input.feedback,
				});
			}}
			isSubmittingFeedback={feedbackMutation.isPending}
			mode="page"
			onBack={() =>
				navigate({
					to: "/mentor-sessions",
				})
			}
			backLabel="Back to hosted sessions"
		/>
	);
}

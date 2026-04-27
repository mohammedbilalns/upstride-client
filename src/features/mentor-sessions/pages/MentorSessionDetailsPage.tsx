import { useNavigate } from "@tanstack/react-router";
import { SessionDetailsDialog } from "@/features/sessions/components/SessionDetailsDialog";
import { useSessionDetails } from "@/features/sessions/hooks/queries/useSessionDetails";
import { Route } from "@/routes/_app-layout/_mentor-layout/mentor-sessions/$sessionId";

export function MentorSessionDetailsPage() {
	const navigate = useNavigate({ from: Route.fullPath });
	const { sessionId } = Route.useParams();
	const { data, isLoading } = useSessionDetails(sessionId);
	const booking = data?.data.booking ?? null;

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
			showReceipt={false}
			canSubmitReview={false}
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

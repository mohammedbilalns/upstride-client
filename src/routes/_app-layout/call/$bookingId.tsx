import { createFileRoute, redirect } from "@tanstack/react-router";
import { sessionBookingService } from "@/features/session-booking/services/booking.service";
import { CallRoom } from "@/features/session-call/components/CallRoom";

export const Route = createFileRoute("/_app-layout/call/$bookingId")({
	loader: async ({ params, context }) => {
		try {
			const userId = context.auth.user?.id;
			const bookingResponse = await sessionBookingService.getBookingDetails(
				params.bookingId,
			);
			const booking = bookingResponse.data.booking;

			if (
				!booking ||
				booking.status === "PENDING" ||
				(booking.mentorUserId !== userId && booking.menteeId !== userId)
			) {
				throw redirect({ to: "/" });
			}

			return {
				booking,
				userId: userId,
				isMentor: booking.mentorUserId === userId,
				menteeId: booking.menteeId,
			};
		} catch (error) {
			console.error("Failed to load booking details for call", error);
			throw redirect({ to: "/" });
		}
	},
	component: CallPage,
});

function CallPage() {
	const { booking, isMentor, menteeId } = Route.useLoaderData();

	return (
		<CallRoom
			bookingId={booking.id}
			isMentor={isMentor}
			menteeId={menteeId}
			localParticipantName={
				isMentor
					? (booking.mentorName ?? "Mentor")
					: (booking.menteeName ?? "You")
			}
			remoteParticipantName={
				isMentor
					? (booking.menteeName ?? "Participant")
					: (booking.mentorName ?? "Mentor")
			}
		/>
	);
}

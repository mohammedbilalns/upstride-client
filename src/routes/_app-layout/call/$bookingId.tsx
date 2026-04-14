import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { authService } from "@/features/authentication/services/auth.service";
import { sessionBookingService } from "@/features/session-booking-management/services/session-booking.service";
import { CallRoom } from "@/features/session-call/components/CallRoom";

export const Route = createFileRoute("/_app-layout/call/$bookingId")({
	loader: async ({ params }) => {
		// Ideally we would fetch the booking details here and ensure the
		// current user is either the mentor or the mentee.
		try {
			const me = await authService.getMe();
			const userId = me.data.user.id;
			const bookingResponse = await sessionBookingService.getBookingDetails(
				params.bookingId,
			);
			const booking = bookingResponse.data.booking;

			if (
				!booking ||
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
		<CallRoom bookingId={booking.id} isMentor={isMentor} menteeId={menteeId} />
	);
}

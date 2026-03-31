import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { PaymentSuccessPage } from "@/features/payment/pages/PaymentSuccessPage";

const SearchSchema = z.object({
	id: z.string().optional(),
});

export const Route = createFileRoute(
	"/_app-layout/_user-layout/bookings/success",
)({
	validateSearch: (search) => SearchSchema.parse(search),
	component: BookingPaymentSuccess,
});

function BookingPaymentSuccess() {
	const search = Route.useSearch();
	return (
		<PaymentSuccessPage
			title="Session booked successfully"
			description="Your payment was completed and your session is confirmed. You can view the details in your sessions list."
			primaryActionLabel="View sessions"
			primaryActionTo="/sessions"
			secondaryActionLabel="Go home"
			secondaryActionTo="/home"
			bookingId={search.id}
		/>
	);
}

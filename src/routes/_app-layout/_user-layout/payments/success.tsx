import { createFileRoute } from "@tanstack/react-router";
import { PaymentSuccessPage } from "@/features/payment/pages/PaymentSuccessPage";

export const Route = createFileRoute(
	"/_app-layout/_user-layout/payments/success",
)({
	component: CoinPaymentSuccess,
});

function CoinPaymentSuccess() {
	return (
		<PaymentSuccessPage
			title="Payment successful"
			description="Your wallet top-up has been processed. It can take a moment for your updated balance to appear."
			primaryActionLabel="Go to wallet"
			primaryActionTo="/coins"
			secondaryActionLabel="Go home"
			secondaryActionTo="/home"
		/>
	);
}

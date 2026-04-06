import { useEffect, useState, useCallback } from "react";
import { PaymentSuccessModal } from "@/features/payment/components/PaymentSuccessModal";

export function GlobalSuccessHandler() {
	const [modalConfig, setModalConfig] = useState<any>(null);

	const handleLocationChange = useCallback(() => {
		const search = window.location.search;
		if (!search) return;
		const params = new URLSearchParams(search);
		const isPaymentSuccess = params.get("payment_success") === "true";
		const isBookingSuccess = params.get("booking_success") === "true";
		const bookingId = params.get("booking_id") || params.get("id");

		if (isPaymentSuccess || isBookingSuccess) {
			if (isPaymentSuccess && !isBookingSuccess) {
				setModalConfig({
					title: "Payment successful",
					description:
						"Your wallet top-up has been processed. It can take a moment for your updated balance to appear.",
					primaryActionLabel: "View wallet",
					primaryActionTo: "/coins",
					secondaryActionLabel: "Go home",
					secondaryActionTo: "/home",
				});
			} else if (isBookingSuccess) {
				setModalConfig({
					title: "Session booked successfully",
					description:
						"Your payment was completed and your session is confirmed. You can view the details in your sessions list.",
					primaryActionLabel: "View sessions",
					primaryActionTo: "/sessions",
					secondaryActionLabel: "Go home",
					secondaryActionTo: "/home",
					bookingId: bookingId || undefined,
				});
			}

			// Clean up URL
			params.delete("payment_success");
			params.delete("booking_success");
			params.delete("booking_id");
			params.delete("id");

			// Keep topup and other params if any
			const newSearch = params.toString();
			const newUrl =
				window.location.pathname + (newSearch ? `?${newSearch}` : "");
			window.history.replaceState({}, "", newUrl);
		}
	}, []);

	useEffect(() => {
		handleLocationChange();
	}, [handleLocationChange]);

	if (!modalConfig) return null;

	return (
		<PaymentSuccessModal
			isOpen={true}
			onClose={() => setModalConfig(null)}
			{...modalConfig}
		/>
	);
}

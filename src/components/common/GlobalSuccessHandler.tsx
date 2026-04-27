import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ComponentProps } from "react";
import { useCallback, useEffect, useState } from "react";
import { PaymentSuccessModal } from "@/features/payment/components/PaymentSuccessModal";
import { sessionBookingService } from "@/features/session-booking";

type PaymentSuccessModalConfig = Omit<
	ComponentProps<typeof PaymentSuccessModal>,
	"isOpen" | "onClose"
>;

export function GlobalSuccessHandler() {
	const [modalConfig, setModalConfig] =
		useState<PaymentSuccessModalConfig | null>(null);
	const [pendingBookingId, setPendingBookingId] = useState<string | null>(null);
	const queryClient = useQueryClient();

	const bookingDetailsQuery = useQuery({
		queryKey: ["sessions", "user", "details", pendingBookingId],
		queryFn: () =>
			sessionBookingService.getBookingDetails(pendingBookingId as string),
		enabled: Boolean(pendingBookingId),
		refetchInterval: (query) => {
			const booking = query.state.data?.data.booking;
			if (
				booking?.paymentStatus === "COMPLETED" &&
				booking.status === "CONFIRMED"
			) {
				return false;
			}
			return 2000;
		},
		refetchOnWindowFocus: false,
		retry: 3,
	});

	const clearSuccessParams = useCallback(() => {
		const params = new URLSearchParams(window.location.search);
		params.delete("payment_success");
		params.delete("booking_success");
		params.delete("booking_id");
		params.delete("id");

		const newSearch = params.toString();
		const newUrl =
			window.location.pathname + (newSearch ? `?${newSearch}` : "");
		window.history.replaceState({}, "", newUrl);
	}, []);

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
				if (bookingId) {
					setPendingBookingId(bookingId);
				} else {
					setModalConfig({
						title: "Session booked successfully",
						description:
							"Your payment was completed and your session is confirmed. You can view the details in your sessions list.",
						primaryActionLabel: "View sessions",
						primaryActionTo: "/sessions",
						secondaryActionLabel: "Go home",
						secondaryActionTo: "/home",
					});
				}
			}
		}
	}, []);

	useEffect(() => {
		handleLocationChange();
	}, [handleLocationChange]);

	useEffect(() => {
		const booking = bookingDetailsQuery.data?.data.booking;
		if (!pendingBookingId || !booking) return;

		if (
			booking.paymentStatus !== "COMPLETED" ||
			booking.status !== "CONFIRMED"
		) {
			return;
		}

		setModalConfig({
			title: "Session booked successfully",
			description:
				"Your payment was completed and your session is confirmed. You can view the details in your sessions list.",
			primaryActionLabel: "View sessions",
			primaryActionTo: "/sessions",
			secondaryActionLabel: "Go home",
			secondaryActionTo: "/home",
			bookingId: booking.id,
		});
		setPendingBookingId(null);
		clearSuccessParams();
		queryClient.invalidateQueries({ queryKey: ["sessions", "user"] });
	}, [
		bookingDetailsQuery.data,
		clearSuccessParams,
		pendingBookingId,
		queryClient,
	]);

	if (!modalConfig) return null;

	return (
		<PaymentSuccessModal
			isOpen={true}
			onClose={() => setModalConfig(null)}
			{...modalConfig}
		/>
	);
}

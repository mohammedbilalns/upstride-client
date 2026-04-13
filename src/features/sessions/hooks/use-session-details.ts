import { useQuery } from "@tanstack/react-query";
import { sessionBookingService } from "@/features/session-booking-management";

export const useSessionDetails = (bookingId: string | undefined) =>
	useQuery({
		queryKey: ["sessions", "user", "details", bookingId],
		queryFn: () => sessionBookingService.getBookingDetails(bookingId as string),
		enabled: Boolean(bookingId),
	});

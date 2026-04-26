import { queryOptions, useQuery } from "@tanstack/react-query";
import { sessionBookingService } from "@/features/session-booking";

export const sessionDetailsQueryOptions = (bookingId: string) =>
	queryOptions({
		queryKey: ["sessions", "details", bookingId],
		queryFn: () => sessionBookingService.getBookingDetails(bookingId),
	});

export const useSessionDetails = (bookingId: string | undefined) =>
	useQuery({
		...(bookingId
			? sessionDetailsQueryOptions(bookingId)
			: {
					queryKey: ["sessions", "details", bookingId],
					queryFn: () =>
						sessionBookingService.getBookingDetails(bookingId as string),
				}),
		enabled: Boolean(bookingId),
	});

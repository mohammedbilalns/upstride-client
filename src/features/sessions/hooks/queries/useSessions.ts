import { queryOptions, useQuery } from "@tanstack/react-query";
import { sessionBookingService } from "@/features/session-booking";
import type { GetBookingsInput } from "@/features/session-booking/types";

export const userSessionsQueryOptions = (params: GetBookingsInput) =>
	queryOptions({
		queryKey: ["sessions", "user", params],
		queryFn: () => sessionBookingService.getUserBookings(params),
	});

export const useUserSessions = (params: GetBookingsInput) =>
	useQuery(userSessionsQueryOptions(params));

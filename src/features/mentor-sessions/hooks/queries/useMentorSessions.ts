import { queryOptions, useQuery } from "@tanstack/react-query";
import { sessionBookingService } from "@/features/session-booking";
import type { GetBookingsInput } from "@/features/session-booking/types";

export const mentorSessionsQueryOptions = (params: GetBookingsInput) =>
	queryOptions({
		queryKey: ["sessions", "mentor", params],
		queryFn: () => sessionBookingService.getMentorBookings(params),
	});

export const useMentorSessions = (params: GetBookingsInput) =>
	useQuery(mentorSessionsQueryOptions(params));

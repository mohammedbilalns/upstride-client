import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/api/apiError";
import { sessionBookingService } from "../services/booking.service";

export function useRescheduleBooking() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: {
			bookingId: string;
			startTime: string;
			endTime: string;
		}) =>
			sessionBookingService.rescheduleBooking(
				input.bookingId,
				input.startTime,
				input.endTime,
			),
		onSuccess: (_, variables) => {
			toast.success("Booking rescheduled successfully");
			queryClient.invalidateQueries({ queryKey: ["sessions"] });
			queryClient.invalidateQueries({
				queryKey: ["sessions", "details", variables.bookingId],
			});
		},
		onError: (error: ApiError) => {
			toast.error(
				error?.response?.data?.message || "Failed to reschedule booking",
			);
		},
	});
}

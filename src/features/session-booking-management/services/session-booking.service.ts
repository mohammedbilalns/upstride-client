import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	BookSessionInput,
	BookSessionResponse,
	CancelBookingInput,
	CancelBookingResponse,
	GetBookingsInput,
	GetBookingsResponse,
	HandleRescheduleInput,
	HandleRescheduleResponse,
	RequestRescheduleInput,
	RequestRescheduleResponse,
} from "../types";

export const sessionBookingService = {
	bookSession: async (data: BookSessionInput): Promise<BookSessionResponse> => {
		const response = await api.post<BookSessionResponse>(
			`${ROUTES.SESSION_BOOKINGS.BASE}${ROUTES.SESSION_BOOKINGS.BOOK}`,
			data,
		);
		return response.data;
	},

	cancelBooking: async (
		data: CancelBookingInput,
	): Promise<CancelBookingResponse> => {
		const response = await api.patch<CancelBookingResponse>(
			`${ROUTES.SESSION_BOOKINGS.BASE}${ROUTES.SESSION_BOOKINGS.CANCEL(
				data.bookingId,
			)}`,
		);
		return response.data;
	},

	requestReschedule: async (
		data: RequestRescheduleInput,
	): Promise<RequestRescheduleResponse> => {
		const response = await api.patch<RequestRescheduleResponse>(
			`${ROUTES.SESSION_BOOKINGS.BASE}${ROUTES.SESSION_BOOKINGS.REQUEST_RESCHEDULE(
				data.bookingId,
			)}`,
		);
		return response.data;
	},

	handleReschedule: async (
		data: HandleRescheduleInput,
	): Promise<HandleRescheduleResponse> => {
		const response = await api.patch<HandleRescheduleResponse>(
			`${ROUTES.SESSION_BOOKINGS.BASE}${ROUTES.SESSION_BOOKINGS.HANDLE_RESCHEDULE(
				data.bookingId,
			)}`,
			{ newSlotId: data.newSlotId },
		);
		return response.data;
	},

	getUserBookings: async (
		params: GetBookingsInput = {},
	): Promise<GetBookingsResponse> => {
		const response = await api.get<GetBookingsResponse>(
			`${ROUTES.SESSION_BOOKINGS.BASE}${ROUTES.SESSION_BOOKINGS.USER}`,
			{ params },
		);
		return response.data;
	},

	getMentorBookings: async (
		params: GetBookingsInput = {},
	): Promise<GetBookingsResponse> => {
		const response = await api.get<GetBookingsResponse>(
			`${ROUTES.SESSION_BOOKINGS.BASE}${ROUTES.SESSION_BOOKINGS.MENTOR}`,
			{ params },
		);
		return response.data;
	},
};

import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	BookSessionInput,
	BookSessionResponse,
	CancelBookingInput,
	CancelBookingResponse,
	GetBookingsInput,
	GetBookingsResponse,
	GetBookingDetailsResponse,
} from "../types";

export const sessionBookingService = {
	bookSession: async (data: BookSessionInput): Promise<BookSessionResponse> => {
		const response = await api.post<BookSessionResponse>(
			`${ROUTES.BOOKINGS.BASE}${ROUTES.BOOKINGS.ROOT}`,
			data,
		);
		return response.data;
	},

	cancelBooking: async (
		data: CancelBookingInput,
	): Promise<CancelBookingResponse> => {
		const response = await api.put<CancelBookingResponse>(
			`${ROUTES.BOOKINGS.BASE}${ROUTES.BOOKINGS.CANCEL(data.bookingId)}`,
			{ reason: data.reason },
		);
		return response.data;
	},

	cancelBookingByMentor: async (
		data: CancelBookingInput,
	): Promise<CancelBookingResponse> => {
		const response = await api.put<CancelBookingResponse>(
			`${ROUTES.BOOKINGS.BASE}${ROUTES.BOOKINGS.MENTOR_CANCEL(data.bookingId)}`,
			{ reason: data.reason },
		);
		return response.data;
	},

	getUserBookings: async (
		params: GetBookingsInput = {},
	): Promise<GetBookingsResponse> => {
		const response = await api.get<GetBookingsResponse>(
			`${ROUTES.BOOKINGS.BASE}${ROUTES.BOOKINGS.USER}`,
			{ params },
		);
		return response.data;
	},

	getMentorBookings: async (
		params: GetBookingsInput = {},
	): Promise<GetBookingsResponse> => {
		const response = await api.get<GetBookingsResponse>(
			`${ROUTES.BOOKINGS.BASE}${ROUTES.BOOKINGS.MENTOR}`,
			{ params },
		);
		return response.data;
	},
	getBookingDetails: async (
		bookingId: string,
	): Promise<GetBookingDetailsResponse> => {
		const response = await api.get<GetBookingDetailsResponse>(
			`${ROUTES.BOOKINGS.BASE}${ROUTES.BOOKINGS.BY_ID(bookingId)}`,
		);
		return response.data;
	},
	repayBooking: async (bookingId: string): Promise<BookSessionResponse> => {
		const response = await api.post<BookSessionResponse>(
			`${ROUTES.BOOKINGS.BASE}${ROUTES.BOOKINGS.REPAY(bookingId)}`,
		);
		return response.data;
	},
};

import type { ApiSuccess } from "@/api/apiSuccess";
import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	BookSessionInput,
	BookSessionResponse,
	CancelBookingInput,
	CancelBookingResponse,
	CreateFeedbackInput,
	GetBookingDetailsResponse,
	GetBookingsInput,
	GetBookingsResponse,
} from "../types";

export const sessionBookingService = {
	bookSession: async (data: BookSessionInput) => {
		const response = await api.post<ApiSuccess<BookSessionResponse>>(
			`${ROUTES.BOOKINGS.BASE}${ROUTES.BOOKINGS.ROOT}`,
			data,
		);
		return response.data;
	},

	cancelBooking: async (data: CancelBookingInput) => {
		const response = await api.put<ApiSuccess<CancelBookingResponse>>(
			`${ROUTES.BOOKINGS.BASE}${ROUTES.BOOKINGS.CANCEL(data.bookingId)}`,
			{ reason: data.reason },
		);
		return response.data;
	},

	cancelBookingByMentor: async (data: CancelBookingInput) => {
		const response = await api.put<ApiSuccess<CancelBookingResponse>>(
			`${ROUTES.BOOKINGS.BASE}${ROUTES.BOOKINGS.MENTOR_CANCEL(data.bookingId)}`,
			{ reason: data.reason },
		);
		return response.data;
	},

	getUserBookings: async (params: GetBookingsInput = {}) => {
		const response = await api.get<ApiSuccess<GetBookingsResponse>>(
			`${ROUTES.BOOKINGS.BASE}${ROUTES.BOOKINGS.USER}`,
			{ params },
		);
		return response.data;
	},

	getMentorBookings: async (params: GetBookingsInput = {}) => {
		const response = await api.get<ApiSuccess<GetBookingsResponse>>(
			`${ROUTES.BOOKINGS.BASE}${ROUTES.BOOKINGS.MENTOR}`,
			{ params },
		);
		return response.data;
	},
	getBookingDetails: async (bookingId: string) => {
		const response = await api.get<ApiSuccess<GetBookingDetailsResponse>>(
			`${ROUTES.BOOKINGS.BASE}${ROUTES.BOOKINGS.BY_ID(bookingId)}`,
		);
		return response.data;
	},
	createFeedback: async (input: CreateFeedbackInput) => {
		const response = await api.post<ApiSuccess>(
			`${ROUTES.BOOKINGS.BASE}${ROUTES.BOOKINGS.FEEDBACK}`,
			input,
		);
		return response.data;
	},
	repayBooking: async (bookingId: string) => {
		const response = await api.post<ApiSuccess<BookSessionResponse>>(
			`${ROUTES.BOOKINGS.BASE}${ROUTES.BOOKINGS.REPAY(bookingId)}`,
		);
		return response.data;
	},
	rescheduleBooking: async (
		bookingId: string,
		startTime: string,
		endTime: string,
	) => {
		const response = await api.patch<ApiSuccess>(
			`${ROUTES.BOOKINGS.BASE}${ROUTES.BOOKINGS.RESCHEDULE(bookingId)}`,
			{ startTime, endTime },
		);
		return response.data;
	},
	downloadReceipt: async (bookingId: string): Promise<void> => {
		const response = await api.get(
			`${ROUTES.BOOKINGS.BASE}${ROUTES.BOOKINGS.RECEIPT(bookingId)}`,
			{ responseType: "blob" },
		);

		const blob = new Blob([response.data], { type: "application/pdf" });
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `receipt-${bookingId}.pdf`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		window.URL.revokeObjectURL(url);
	},
};

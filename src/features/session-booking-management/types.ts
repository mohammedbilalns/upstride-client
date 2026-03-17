export interface BookSessionInput {
	slotId: string;
	coinsDebited: number;
	transactionId: string;
}

export interface BookSessionResponse {
	message: string;
	data: {
		bookingId: string;
	};
}

export interface CancelBookingInput {
	bookingId: string;
}

export interface CancelBookingResponse {
	message: string;
	data: {
		bookingId: string;
		status: "cancelled";
	};
}

export interface RequestRescheduleInput {
	bookingId: string;
}

export interface RequestRescheduleResponse {
	message: string;
	data: {
		bookingId: string;
		status: "pending";
	};
}

export interface HandleRescheduleInput {
	bookingId: string;
	newSlotId: string;
}

export interface HandleRescheduleResponse {
	message: string;
	data: {
		bookingId: string;
		status: "confirmed";
	};
}

export type BookingFilter = "past" | "cancelled" | "upcoming" | "all";

export interface GetBookingsInput {
	filter?: BookingFilter;
	page?: number;
	limit?: number;
}

export interface BookingListItem {
	id: string;
	userId: string;
	mentorId: string;
	slotId: string;
	startTime: string;
	endTime: string;
	price: number;
	status: "pending" | "confirmed" | "cancelled" | "completed" | "refunded";
	createdAt: string;
	updatedAt: string;
}

export interface GetBookingsResponse {
	message: string;
	data: {
		items: BookingListItem[];
		total: number;
		page: number;
		limit: number;
		totalPages: number;
	};
}

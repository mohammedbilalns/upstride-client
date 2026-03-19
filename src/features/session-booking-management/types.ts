export interface BookSessionInput {
	slotId: string;
}

export interface BookSessionResponse {
	message: string;
	data: {
		bookingId: string;
	};
}

export interface CancelBookingInput {
	bookingId: string;
	reason: string;
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
	mentorName: string | null;
	slotId: string;
	startTime: string;
	endTime: string;
	price: number;
	status: "pending" | "confirmed" | "cancelled" | "completed" | "refunded";
	attendanceStatus: "attended" | "not_attended" | null;
	meetingId: string | null;
	meetingUrl: string | null;
	cancellationReason: string | null;
	cancelledBy: "user" | "mentor" | null;
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

export type PaymentType = "COINS" | "STRIPE";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
export type BookingStatus =
	| "PENDING"
	| "CONFIRMED"
	| "STARTED"
	| "COMPLETED"
	| "CANCELLED_BY_MENTEE"
	| "CANCELLED_BY_MENTOR";

export interface BookSessionInput {
	slotId?: string;
	mentorId?: string;
	startTime?: string;
	endTime?: string;
	paymentType?: PaymentType;
	notes?: string;
}

export interface BookSessionResponse {
	bookingId: string;
	paymentStatus?: "PENDING" | "COMPLETED";
	paymentUrl?: string;
}

export interface CancelBookingInput {
	bookingId: string;
	reason: string;
}

export interface CancelBookingResponse {
	bookingId: string;
	status: string;
	refund?: {
		amount: number;
		percentage: number;
		currency: "COINS";
		reason: string;
	};
}

export type BookingFilter =
	| "past"
	| "completed"
	| "cancelled"
	| "upcoming_cancelled"
	| "past_cancelled"
	| "upcoming"
	| "all"
	| "payment_pending";

export interface GetBookingsInput {
	filter?: BookingFilter;
	page?: number;
	limit?: number;
}

export interface Booking {
	id: string;
	mentorId: string;
	mentorUserId: string | null;
	menteeId: string;
	startTime: string;
	endTime: string;
	startDate: string;
	status: BookingStatus;
	paymentType: PaymentType;
	paymentStatus: PaymentStatus;
	totalAmount: number;
	currency: string;
	meetingLink: string;
	notes: string | null;
	menteeName: string | null;
	mentorName: string | null;
	review: ReviewDto | null;
	settledAt: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface GetBookingsResponse {
	items: Booking[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface GetBookingDetailsResponse {
	booking: Booking;
}

// Keep legacy ones if needed for now
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
import type { ReviewDto } from "@/features/reviews";

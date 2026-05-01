export type DayOfWeek =
	| "Monday"
	| "Tuesday"
	| "Wednesday"
	| "Thursday"
	| "Friday"
	| "Saturday"
	| "Sunday";

export interface BreakTime {
	startTime: string; // HH:mm
	endTime: string; // HH:mm
}

export interface AvailabilityRule {
	id: string;
	mentorId: string;
	name: string;
	description: string;
	days: DayOfWeek[];
	startTime: string; // HH:mm
	endTime: string; // HH:mm
	startDate: string; // YYYY-MM-DD
	endDate: string; // YYYY-MM-DD
	breakTimes: BreakTime[];
	slotDuration: 30 | 60;
	bufferTime: number;
	status: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateAvailabilityInput {
	name: string;
	description: string;
	days: DayOfWeek[];
	startTime: string; // HH:mm
	endTime: string; // HH:mm
	startDate: string; // YYYY-MM-DD
	endDate: string; // YYYY-MM-DD
	breakTimes?: BreakTime[];
	slotDuration: 30 | 60;
	bufferTime?: number;
}

export interface ReenableAvailabilityInput {
	ruleId: string;
}

export interface GetMentorAvailabilitiesInput {
	mentorId: string;
	includeExpired?: boolean;
	expiredOnly?: boolean;
	status?: "active" | "disabled";
	page?: number;
	limit?: number;
}

export interface AvailabilitySlot {
	startTime: string; // ISO
	endTime: string; // ISO
	durationMinutes: number;
	price: number;
	status: "AVAILABLE" | "BOOKED" | "BOOKED_PENDING";
	bookingId?: string;
	bookingPaymentStatus?: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
}

export interface PublicMentorAvailableSlotsResponse {
	slots: AvailabilitySlot[];
}

export interface MentorAvailabilitiesResponse {
	availabilities: AvailabilityRule[];
	pagination?: {
		page: number;
		limit: number;
		totalPages: number;
		totalCount: number;
	};
}

export interface CheckAndCreateAvailabilityResponse {
	created: boolean;
	availability?: AvailabilityRule;
	conflicts?: ConflictAvailabilitySummary[];
}

export interface CheckAndReenableAvailabilityResponse {
	enabled: boolean;
	conflicts?: ConflictAvailabilitySummary[];
}

export interface UpdateAvailabilityInput {
	id: string;
	name?: string;
	description?: string;
	days?: DayOfWeek[];
	startTime?: string;
	endTime?: string;
	startDate?: string;
	endDate?: string;
	breakTimes?: BreakTime[];
	slotDuration?: 30 | 60;
	bufferTime?: number;
}

export interface CheckAndUpdateAvailabilityResponse {
	updated: boolean;
	availability?: AvailabilityRule;
	conflicts?: ConflictAvailabilitySummary[];
}

export interface ConflictAvailabilitySummary {
	name: string;
	startDate: string; // YYYY-MM-DD
	endDate: string; // YYYY-MM-DD
	startTime: string; // HH:mm
	endTime: string; // HH:mm
}

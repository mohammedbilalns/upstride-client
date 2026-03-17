export interface CancelSlotInput {
	slotId: string;
}

export interface CancelSlotResponse {
	message: string;
	data: {
		slotId: string;
		status: "blocked";
	};
}

export interface EnableSlotInput {
	slotId: string;
}

export interface EnableSlotResponse {
	message: string;
	data: {
		slotId: string;
		status: "available";
	};
}

export interface DeleteSlotInput {
	slotId: string;
}

export interface DeleteSlotResponse {
	message: string;
	data: {
		slotId: string;
	};
}

export interface CreateCustomSlotInput {
	startTime: string;
	endTime: string;
	durationMinutes: 30 | 60;
}

export interface CreateCustomSlotResponse {
	message: string;
	data: {
		slotId: string;
	};
}

export interface GenerateSlotsInput {
	mentorId: string;
	startDate?: string;
	endDate?: string;
}

export interface GenerateSlotsResponse {
	message: string;
	data: {
		createdCount: number;
	};
}

export interface GetMentorSlotsInput {
	startDate?: string;
	endDate?: string;
}

export interface MentorSlotDto {
	id: string;
	startTime: string;
	endTime: string;
	durationMinutes: number;
	price: number;
	status: "available" | "booked" | "blocked";
	bookingId: string | null;
	createdFromRuleId: string | null;
}

export interface GetMentorSlotsResponse {
	message: string;
	data: {
		slots: MentorSlotDto[];
	};
}

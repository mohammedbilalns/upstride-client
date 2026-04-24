export interface PublicMentorSlot {
	startTime: string; // ISO
	endTime: string; // ISO
	durationMinutes: number;
	price: number;
	status: "AVAILABLE" | "BOOKED" | "BOOKED_PENDING";
	bookingId?: string;
	bookingPaymentStatus?: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
}

export interface PublicMentorProfile {
	id: string;
	user: {
		id: string;
		name: string;
		avatar?: string;
	};
	bio: string;
	organization: string;
	currentRole: {
		id: string;
		name: string;
	};
	personalWebsite: string | null;
	educationalQualifications: string[];
	expertises: { id: string; name: string }[];
	skills: { id: string; name: string; level: string }[];
	yearsOfExperience: number;
	avgRating: number;
}

export interface PublicMentorProfileResponse {
	profile: PublicMentorProfile;
	nextAvailableSessions: PublicMentorSlot[];
	isReported?: boolean;
}

export interface PublicMentorAvailableSlotsResponse {
	message: string;
	data: {
		slots: PublicMentorSlot[];
	};
}

export interface PublicMentorSlot {
	id: string;
	startTime: string;
	endTime: string;
	durationMinutes: number;
	price: number;
	currency: "coins";
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
	message: string;
	data: {
		profile: PublicMentorProfile;
		nextAvailableSessions: PublicMentorSlot[];
		isReported?: boolean;
	};
}

export interface PublicMentorAvailableSlotsResponse {
	message: string;
	data: {
		slots: PublicMentorSlot[];
	};
}

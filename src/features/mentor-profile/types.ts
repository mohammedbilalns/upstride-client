export interface MentorProfileResponse {
	profile: {
		id: string;
		user: {
			id: string;
			name: string;
			email: string;
		};
		bio: string;
		organization: string;
		currentRole: {
			id: string;
			name: string;
		};
		personalWebsite: string | null;
		educationalQualifications: string[];
		languages: string[];
		expertises: { id: string; name: string }[];
		skills: { id: string; name: string; level: string }[];
		tierName: string | null;
		tierMax30minPayment: number | null;
		currentPricePer30Min: number | null;
		mentorSessionEarningPercentage: number;
	};
}

export interface UpdateMentorProfileInput {
	currentRoleId?: string;
	organization?: string;
	areasOfExpertise?: string[];
	languages?: string[];
	currentPricePer30Min?: number;
	bio?: string;
	educationalQualifications?: string[];
	addSkills?: {
		skillId: string;
		level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
	}[];
	removeSkills?: string[];
	addEducationalQualifications?: string[];
}

export interface UpdateMentorProfileResponse {
	profile: MentorProfileResponse["profile"];
}

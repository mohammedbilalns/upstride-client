export interface GetMentorApplicationsInput {
	page: number;
	limit: number;
	status?: "approved" | "rejected" | "pending";
	sort?: "recent" | "old" | "status";
}

export interface Mentor {
	id: string;
	userId: string;
	name: string;
	email: string;
	organization: string;
	yearsOfExperience: number;
	currentRole: string;
	bio: string;
	personalWebsite: string | null;
	expertises: {
		name: string;
		skills: {
			name: string;
			level: string;
		}[];
	}[];
	resumeUrl: string;
	resubmissionCount: number;
	status: "approved" | "rejected" | "pending";
	rejectionReason: string | null;
	appliedAt: string;
	updatedAt: string;
}

export interface GetMentorApplicationsResponse {
	items: Mentor[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface RejectMentorInput {
	mentorId: string;
	reason: string;
}

import type { SkillLevel } from "@/shared/types/user";

export interface MentorExperience {
	company: string;
	role: string;
	description: string;
	from: string;
	to: string | null;
}

export interface MentorSkill {
	skillId: string;
	level: SkillLevel;
}

export interface Mentor {
	id: string;
	userId: string;
	bio: string;
	currentRoleId: string;
	organization: string;
	yearsOfExperience: number;
	personalWebsite: string;
	resumeId: string;
	educationalQualifications: string[];
	areasOfExpertise: string[];
	toolsAndSkills: MentorSkill[];
	experience: MentorExperience[];
	isApproved: boolean;
	applicationAttempts: number;
	isRejected: boolean;
	updatedAt: string;
	rejectionReason: string | null;
}

export interface MentorRegistrationInfoResponse {
	canApply: boolean;
	attemptsCount: number;
	maxAttempts: number;
	existingProfile: Mentor | null;
	rejectionReason: string | null;
}

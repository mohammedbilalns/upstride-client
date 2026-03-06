export type UserRole = "USER" | "MENTOR" | "ADMIN" | "SUPER_ADMIN";
export type SkillLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface UserProfileDTO {
	id: string;
	name: string;
	email: string;
	phone: string;
	role: UserRole;
	profilePictureUrl: string | null;
	preferences?: {
		interests: {
			id: string;
			name: string;
			skills: {
				skillId: string;
				name: string;
				level: SkillLevel;
			}[];
		}[];
	};
}

export interface GetProfileOutput {
	profile: UserProfileDTO;
}

export interface UpdateProfileInput {
	name?: string;
	profilePictureId?: string;
	interests?: string[];
	skills?: {
		skillId: string;
		level: SkillLevel;
	}[];
}

export interface UpdateProfileOutput {
	success: boolean;
	message: string;
}

export type UserRole = "USER" | "MENTOR" | "ADMIN" | "SUPER_ADMIN";
export type AuthType = "LOCAL" | "GOOGLE" | "LINKEDIN";
export type SkillLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export interface User {
	id: string;
	name: string;
	email: string;
	phone: string;
	authType: AuthType;
	profilePictureId: string | null;
	role: UserRole;
	isBlocked: boolean;
	isVerified: boolean;
	createdAt: Date;
	updatedAt: Date;
	preferences?: {
		interests: string[];
		skills: {
			skillId: string;
			level: SkillLevel;
		}[];
	};
}

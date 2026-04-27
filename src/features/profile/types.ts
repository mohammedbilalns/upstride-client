import type { AuthType, UserRole } from "@/shared/types/user";

export interface UserProfile {
	id: string;
	name: string;
	email: string;
	phone: string;
	role: UserRole;
	authType: AuthType;
	profilePictureUrl: string | null;
	preferences?: {
		interests: {
			id: string;
			name: string;
			skills: {
				skillId: string;
				name: string;
			}[];
		}[];
	};
}

export interface GetProfileOutput {
	profile: UserProfile;
}

export interface UpdateProfileInput {
	name?: string;
	profilePictureId?: string;
	interests?: string[];
	skills?: {
		skillId: string;
	}[];
}

export interface UpdateProfileOutput {
	success: boolean;
	message: string;
}

export interface RequestChangePasswordInput {
	oldPassword: string;
}

export interface VerifyChangePasswordOtpInput {
	otp: string;
}

export interface VerifyChangePasswordOtpOutput {
	message: string;
	data: {
		resetToken: string;
	};
}

export interface ChangePasswordInput {
	token: string;
	newPassword: string;
}

export interface ChangePasswordOutput {
	message: string;
}

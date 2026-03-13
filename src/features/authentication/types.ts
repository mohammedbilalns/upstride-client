export type AuthView =
	| "login"
	| "register"
	| "register-otp"
	| "forgot-password"
	| "forgot-password-otp"
	| "change-password"
	| "onboarding";

import type { User } from "@/shared/types/user";

export type AuthenticatedUser = Pick<User, "id" | "name" | "role"> & {
	profilePictureUrl: string | null;
	isLocalAuth: boolean;
};

export interface LoginResponse {
	user: AuthenticatedUser;
	accessToken: string;
	refreshToken?: string;
}

export interface RegisterResponse {
	message: string;
}

export interface VerifyRegisterOtpResponse {
	setupToken: string;
}

export interface VerifyResetOtpResponse {
	resetToken: string;
}

export type SaveUserInterestsResponse = LoginResponse;

export interface RequestPasswordResetInput {
	email: string;
}

export interface ChangePasswordInput {
	tempToken: string;
	email: string;
	newPassword: string;
}

export interface ActiveSession {
	id: string;
	deviceName: string;
	deviceType: string;
	lastUsedAt: string;
	isCurrent: boolean;
}

export interface GetActiveSessionsResponse {
	sessions: ActiveSession[];
}

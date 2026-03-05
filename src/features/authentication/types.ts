export type AuthView =
	| "login"
	| "register"
	| "register-otp"
	| "forgot-password"
	| "forgot-password-otp"
	| "change-password";

import type { User } from "@/shared/types/user";

export type AuthenticatedUser = Pick<User, "id" | "name" | "role"> & {
	profilePictureUrl: string | null;
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

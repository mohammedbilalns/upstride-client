import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	LoginResponse,
	SaveUserInterestsResponse,
	VerifyRegisterOtpResponse,
	VerifyResetOtpResponse,
} from "../types";
import type { LoginPayload } from "../validators/login.schema";
import type { RegisterPayload } from "../validators/register.schema";

export const authService = {
	login: async (
		data: LoginPayload,
	): Promise<{ message: string; data: LoginResponse }> => {
		const response = await api.post(
			`${ROUTES.AUTH.BASE}${ROUTES.AUTH.LOGIN}`,
			data,
		);
		return response.data;
	},

	register: async (data: RegisterPayload): Promise<{ message: string }> => {
		const response = await api.post(
			`${ROUTES.AUTH.BASE}${ROUTES.AUTH.REGISTER}`,
			data,
		);
		return response.data;
	},

	verifyRegisterOtp: async (
		email: string,
		otp: string,
	): Promise<{ message: string; data: VerifyRegisterOtpResponse }> => {
		const response = await api.post(
			`${ROUTES.AUTH.BASE}${ROUTES.AUTH.VERIFY_REGISTER_OTP}`,
			{ email, otp },
		);
		return response.data;
	},

	resendRegisterOtp: async (email: string): Promise<{ message: string }> => {
		const response = await api.post(
			`${ROUTES.AUTH.BASE}${ROUTES.AUTH.RESEND_REGISTER_OTP}`,
			{ email },
		);
		return response.data;
	},

	logout: async (): Promise<{ message: string }> => {
		const response = await api.post(`${ROUTES.AUTH.BASE}${ROUTES.AUTH.LOGOUT}`);
		return response.data;
	},

	refreshToken: async (): Promise<{ message: string; data: LoginResponse }> => {
		const response = await api.post(
			`${ROUTES.AUTH.BASE}${ROUTES.AUTH.REFRESH}`,
		);
		return response.data;
	},

	requestPasswordReset: async (email: string): Promise<{ message: string }> => {
		const response = await api.post(
			`${ROUTES.AUTH.BASE}${ROUTES.AUTH.REQUEST_PASSWORD_RESET}`,
			{ email },
		);
		return response.data;
	},

	verifyResetPasswordOtp: async (
		email: string,
		otp: string,
	): Promise<{ message: string; data: VerifyResetOtpResponse }> => {
		const response = await api.post(
			`${ROUTES.AUTH.BASE}${ROUTES.AUTH.VERIFY_RESET_PASSWORD_OTP}`,
			{ email, code: otp },
		);
		return response.data;
	},

	resendResetPasswordOtp: async (
		email: string,
	): Promise<{ message: string }> => {
		const response = await api.post(
			`${ROUTES.AUTH.BASE}${ROUTES.AUTH.RESEND_RESET_PASSWORD_OTP}`,
			{ email },
		);
		return response.data;
	},

	changePassword: async (data: {
		tempToken: string;
		email: string;
		newPassword: string;
	}): Promise<{ message: string }> => {
		const response = await api.post(
			`${ROUTES.AUTH.BASE}${ROUTES.AUTH.CHANGE_PASSWORD}`,
			data,
		);
		return response.data;
	},

	saveInterests: async (data: {
		setupToken: string;
		interests: string[];
		skills: { skillId: string; level: string }[];
	}): Promise<{ message: string; data: SaveUserInterestsResponse }> => {
		const response = await api.post(
			`${ROUTES.AUTH.BASE}${ROUTES.AUTH.SAVE_INTERESTS}`,
			data,
		);
		return response.data;
	},
};

import type { ApiSuccess } from "@/api/apiSuccess";
import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	AuthenticatedUser,
	ChangePasswordInput,
	GetActiveSessionsResponse,
	LoginResponse,
	RequestPasswordResetInput,
	SaveUserInterestsResponse,
	SocialLoginInput,
	SocialLoginResponse,
	VerifyRegisterOtpResponse,
	VerifyResetOtpResponse,
} from "../types";
import type { LoginFormValues } from "../validators/login.schema";
import type { RegisterFormValues } from "../validators/register.schema";

export const authService = {
	login: async (data: LoginFormValues) => {
		const response = await api.post<ApiSuccess<LoginResponse>>(
			`${ROUTES.AUTH.BASE}${ROUTES.AUTH.LOGIN}`,
			data,
		);
		return response.data;
	},

	dummyLogin: async () => {
		const response = await api.post<ApiSuccess<LoginResponse>>(
			`${ROUTES.AUTH.BASE}${ROUTES.AUTH.DUMMY_LOGIN}`,
		);
		return response.data;
	},

	register: async (data: Omit<RegisterFormValues, "confirmPassword">) => {
		const response = await api.post<ApiSuccess>(
			`${ROUTES.AUTH.BASE}${ROUTES.AUTH.REGISTER}`,
			data,
		);
		return response.data;
	},

	verifyRegisterOtp: async (email: string, otp: string) => {
		const response = await api.post<ApiSuccess<VerifyRegisterOtpResponse>>(
			`${ROUTES.AUTH.BASE}${ROUTES.AUTH.VERIFY_REGISTER_OTP}`,
			{ email, otp },
		);
		return response.data;
	},

	resendRegisterOtp: async (email: string) => {
		const response = await api.post<ApiSuccess>(
			`${ROUTES.AUTH.BASE}${ROUTES.AUTH.RESEND_REGISTER_OTP}`,
			{ email },
		);
		return response.data;
	},

	socialLogin: async (data: SocialLoginInput) => {
		const endpoint =
			data.provider === "GOOGLE" ? ROUTES.AUTH.GOOGLE : ROUTES.AUTH.LINKEDIN;
		const response = await api.post<ApiSuccess<SocialLoginResponse>>(
			`${ROUTES.AUTH.BASE}${endpoint}`,
			data,
		);
		return response.data;
	},

	logout: async () => {
		const response = await api.post<ApiSuccess>(
			`${ROUTES.AUTH.BASE}${ROUTES.AUTH.LOGOUT}`,
		);
		return response.data;
	},

	refreshToken: async () => {
		const response = await api.post<ApiSuccess<LoginResponse>>(
			`${ROUTES.AUTH.BASE}${ROUTES.AUTH.REFRESH}`,
		);
		return response.data;
	},
	getCsrfToken: async () => {
		const response = await api.get<ApiSuccess<{ csrfToken: string }>>(
			`${ROUTES.AUTH.BASE}${ROUTES.AUTH.CSRF}`,
		);
		return response.data;
	},

	requestPasswordReset: async (data: RequestPasswordResetInput) => {
		const response = await api.post<ApiSuccess>(
			`${ROUTES.AUTH.BASE}${ROUTES.AUTH.REQUEST_PASSWORD_RESET}`,
			data,
		);
		return response.data;
	},

	verifyResetPasswordOtp: async (email: string, otp: string) => {
		const response = await api.post<ApiSuccess<VerifyResetOtpResponse>>(
			`${ROUTES.AUTH.BASE}${ROUTES.AUTH.VERIFY_RESET_PASSWORD_OTP}`,
			{ email, otp },
		);
		return response.data;
	},

	resendResetPasswordOtp: async (email: string) => {
		const response = await api.post<ApiSuccess>(
			`${ROUTES.AUTH.BASE}${ROUTES.AUTH.RESEND_RESET_PASSWORD_OTP}`,
			{ email },
		);
		return response.data;
	},

	changePassword: async (data: ChangePasswordInput) => {
		const response = await api.post<ApiSuccess>(
			`${ROUTES.AUTH.BASE}${ROUTES.AUTH.UPDATE_PASSWORD}`,
			data,
		);
		return response.data;
	},

	saveInterests: async (data: {
		setupToken: string;
		interests: string[];
		skills: { skillId: string }[];
	}) => {
		const response = await api.post<ApiSuccess<SaveUserInterestsResponse>>(
			`${ROUTES.AUTH.BASE}${ROUTES.AUTH.SAVE_INTERESTS}`,
			data,
		);
		return response.data;
	},

	getMe: async () => {
		const response = await api.get<ApiSuccess<{ user: AuthenticatedUser }>>(
			`${ROUTES.PROFILE.BASE}${ROUTES.PROFILE.ME}`,
		);
		return response.data;
	},
	getActiveSessions: async () => {
		const response = await api.get<ApiSuccess<GetActiveSessionsResponse>>(
			`${ROUTES.AUTH.BASE}${ROUTES.AUTH.ACTIVE_SESSIONS}`,
		);
		return response.data;
	},
	revokeSession: async (sessionId: string) => {
		const response = await api.post<ApiSuccess>(
			`${ROUTES.AUTH.BASE}${ROUTES.AUTH.REVOKE_SESSION}`,
			{ targetSessionId: sessionId },
		);
		return response.data;
	},
	revokeAllOtherSessions: async () => {
		const response = await api.post<ApiSuccess>(
			`${ROUTES.AUTH.BASE}${ROUTES.AUTH.REVOKE_ALL_OTHER_SESSIONS}`,
		);
		return response.data;
	},
};

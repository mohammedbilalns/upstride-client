import type { ApiSuccess } from "@/api/apiSuccess";
import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	ChangePasswordInput,
	ChangePasswordOutput,
	GetProfileOutput,
	RequestChangePasswordInput,
	UpdateProfileInput,
	UpdateProfileOutput,
	VerifyChangePasswordOtpInput,
	VerifyChangePasswordOtpOutput,
} from "../types";

export const profileService = {
	getProfile: async () => {
		const response = await api.get<ApiSuccess<GetProfileOutput>>(
			`${ROUTES.PROFILE.BASE}${ROUTES.PROFILE.ROOT}`,
		);
		return response.data.data;
	},

	updateProfile: async (data: UpdateProfileInput) => {
		const response = await api.put<ApiSuccess<UpdateProfileOutput>>(
			`${ROUTES.PROFILE.BASE}${ROUTES.PROFILE.ROOT}`,
			data,
		);
		return response.data;
	},
	requestChangePassword: async (data: RequestChangePasswordInput) => {
		const response = await api.post<ApiSuccess>(
			`${ROUTES.PROFILE.BASE}${ROUTES.PROFILE.REQUEST_CHANGE_PASSWORD}`,
			data,
		);
		return response.data;
	},
	verifyChangePasswordOtp: async (data: VerifyChangePasswordOtpInput) => {
		const response = await api.post<ApiSuccess<VerifyChangePasswordOtpOutput>>(
			`${ROUTES.PROFILE.BASE}${ROUTES.PROFILE.VERIFY_OTP}`,
			data,
		);
		return response.data;
	},
	changePassword: async (data: ChangePasswordInput) => {
		const response = await api.put<ApiSuccess<ChangePasswordOutput>>(
			`${ROUTES.PROFILE.BASE}${ROUTES.PROFILE.CHANGE_PASSWORD}`,
			data,
		);
		return response.data;
	},
};

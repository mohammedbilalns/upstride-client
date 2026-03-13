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
	getProfile: async (): Promise<GetProfileOutput> => {
		const response = await api.get<{ data: GetProfileOutput }>(
			`${ROUTES.PROFILE.BASE}${ROUTES.PROFILE.ROOT}`,
		);
		return response.data.data;
	},
	updateProfile: async (
		data: UpdateProfileInput,
	): Promise<UpdateProfileOutput> => {
		const response = await api.put<UpdateProfileOutput>(
			`${ROUTES.PROFILE.BASE}${ROUTES.PROFILE.ROOT}`,
			data,
		);
		return response.data;
	},
	requestChangePassword: async (
		data: RequestChangePasswordInput,
	): Promise<{ message: string }> => {
		const response = await api.post(
			`${ROUTES.PROFILE.BASE}${ROUTES.PROFILE.REQUEST_CHANGE_PASSWORD}`,
			data,
		);
		return response.data;
	},
	verifyChangePasswordOtp: async (
		data: VerifyChangePasswordOtpInput,
	): Promise<VerifyChangePasswordOtpOutput> => {
		const response = await api.post(
			`${ROUTES.PROFILE.BASE}${ROUTES.PROFILE.VERIFY_OTP}`,
			data,
		);
		return response.data;
	},
	changePassword: async (
		data: ChangePasswordInput,
	): Promise<ChangePasswordOutput> => {
		const response = await api.put(
			`${ROUTES.PROFILE.BASE}${ROUTES.PROFILE.CHANGE_PASSWORD}`,
			data,
		);
		return response.data;
	},
};

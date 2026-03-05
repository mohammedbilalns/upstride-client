import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type { RegisterPayload } from "../validators/register.schema";

export const authService = {
	register: async (data: RegisterPayload) => {
		const response = await api.post(
			`${ROUTES.AUTH.BASE}${ROUTES.AUTH.REGISTER}`,
			data,
		);
		return response.data;
	},

	verifyRegisterOtp: async (email: string, otp: string) => {
		const response = await api.post(
			`${ROUTES.AUTH.BASE}${ROUTES.AUTH.VERIFY_REGISTER_OTP}`,
			{ email, code: otp },
		);
		return response.data;
	},

	resendRegisterOtp: async (email: string) => {
		const response = await api.post(
			`${ROUTES.AUTH.BASE}${ROUTES.AUTH.RESEND_REGISTER_OTP}`,
			{ email },
		);
		return response.data;
	},
};

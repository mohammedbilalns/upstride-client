import type { ApiSuccess } from "@/api/apiSuccess";
import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	GetPlatformPaymentTransactionsInput,
	GetPlatformPaymentTransactionsResponse,
	GetPlatformWalletResponse,
} from "../types";

export const platformTransactionsService = {
	getPlatformWallet: async () => {
		const response = await api.get<ApiSuccess<GetPlatformWalletResponse>>(
			`${ROUTES.WALLET.BASE}${ROUTES.WALLET.PLATFORM_BALANCE}`,
		);
		return response.data.data;
	},

	getPlatformPaymentTransactions: async (
		params: GetPlatformPaymentTransactionsInput,
	) => {
		const response = await api.get<
			ApiSuccess<GetPlatformPaymentTransactionsResponse>
		>(`${ROUTES.WALLET.BASE}${ROUTES.WALLET.PLATFORM_PAYMENT_TRANSACTIONS}`, {
			params,
		});
		return response.data.data;
	},
};

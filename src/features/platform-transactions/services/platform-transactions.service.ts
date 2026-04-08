import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	GetPlatformPaymentTransactionsInput,
	GetPlatformPaymentTransactionsResponse,
	GetPlatformWalletResponse,
} from "../types";

export const platformTransactionsService = {
	getPlatformWallet: async (): Promise<GetPlatformWalletResponse> => {
		const response = await api.get<{ data: GetPlatformWalletResponse }>(
			`${ROUTES.WALLET.BASE}${ROUTES.WALLET.PLATFORM_BALANCE}`,
		);
		return response.data.data;
	},

	getPlatformPaymentTransactions: async (
		params: GetPlatformPaymentTransactionsInput,
	): Promise<GetPlatformPaymentTransactionsResponse> => {
		const response = await api.get<{
			data: GetPlatformPaymentTransactionsResponse;
		}>(`${ROUTES.WALLET.BASE}${ROUTES.WALLET.PLATFORM_PAYMENT_TRANSACTIONS}`, {
			params,
		});
		return response.data.data;
	},
};

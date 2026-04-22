import type { ApiSuccess } from "@/api/apiSuccess";
import api from "@/api/axios";
import { ROUTES } from "@/api/routes";
import type {
	CreateCheckoutSessionInput,
	CreateCheckoutSessionResponse,
	GetCoinBalanceResponse,
	GetCoinTransactionsInput,
	GetCoinTransactionsResponse,
	GetPaymentTransactionsInput,
	GetPaymentTransactionsResponse,
} from "../types";

export const coinManagementService = {
	getCoinBalance: async () => {
		const response = await api.get<ApiSuccess<GetCoinBalanceResponse>>(
			`${ROUTES.WALLET.BASE}${ROUTES.WALLET.COIN_BALANCE}`,
		);
		return response.data.data;
	},

	getCoinTransactions: async (params: GetCoinTransactionsInput) => {
		const response = await api.get<ApiSuccess<GetCoinTransactionsResponse>>(
			`${ROUTES.WALLET.BASE}${ROUTES.WALLET.COIN_TRANSACTIONS}`,
			{ params },
		);
		return response.data.data;
	},

	getPaymentTransactions: async (params: GetPaymentTransactionsInput) => {
		const response = await api.get<ApiSuccess<GetPaymentTransactionsResponse>>(
			`${ROUTES.WALLET.BASE}${ROUTES.WALLET.PAYMENT_TRANSACTIONS}`,
			{ params },
		);
		return response.data.data;
	},

	createCheckoutSession: async (data: CreateCheckoutSessionInput) => {
		const response = await api.post<ApiSuccess<CreateCheckoutSessionResponse>>(
			`${ROUTES.PAYMENTS.BASE}${ROUTES.PAYMENTS.CHECKOUT_SESSION}`,
			data,
		);
		return response.data.data;
	},
};

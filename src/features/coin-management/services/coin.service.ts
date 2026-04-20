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
	getCoinBalance: async (): Promise<GetCoinBalanceResponse> => {
		const response = await api.get<{ data: GetCoinBalanceResponse }>(
			`${ROUTES.WALLET.BASE}${ROUTES.WALLET.COIN_BALANCE}`,
		);
		return response.data.data;
	},

	getCoinTransactions: async (
		params: GetCoinTransactionsInput,
	): Promise<GetCoinTransactionsResponse> => {
		const response = await api.get<{ data: GetCoinTransactionsResponse }>(
			`${ROUTES.WALLET.BASE}${ROUTES.WALLET.COIN_TRANSACTIONS}`,
			{ params },
		);
		return response.data.data;
	},

	getPaymentTransactions: async (
		params: GetPaymentTransactionsInput,
	): Promise<GetPaymentTransactionsResponse> => {
		const response = await api.get<{ data: GetPaymentTransactionsResponse }>(
			`${ROUTES.WALLET.BASE}${ROUTES.WALLET.PAYMENT_TRANSACTIONS}`,
			{ params },
		);
		return response.data.data;
	},

	createCheckoutSession: async (
		data: CreateCheckoutSessionInput,
	): Promise<CreateCheckoutSessionResponse> => {
		const response = await api.post<{ data: CreateCheckoutSessionResponse }>(
			`${ROUTES.PAYMENTS.BASE}${ROUTES.PAYMENTS.CHECKOUT_SESSION}`,
			data,
		);
		return response.data.data;
	},
};

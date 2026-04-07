import type {
	CoinTransaction,
	CoinTransactionType,
	GetCoinTransactionsResponse,
	GetPaymentTransactionsResponse,
	PaginationInput,
	PaymentStatus,
} from "@/features/coin-management/types";

export interface GetPlatformWalletResponse {
	balance: number;
}

export interface GetPlatformCoinTransactionsInput extends PaginationInput {
	type?: CoinTransactionType;
}

export type GetPlatformCoinTransactionsResponse = GetCoinTransactionsResponse;
export type PlatformCoinTransaction = CoinTransaction;

export interface GetPlatformPaymentTransactionsInput extends PaginationInput {
	status?: PaymentStatus;
}

export type GetPlatformPaymentTransactionsResponse =
	GetPaymentTransactionsResponse;

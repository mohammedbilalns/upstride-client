import type {
	GetPaymentTransactionsResponse,
	PaginationInput,
	PaymentStatus,
} from "@/features/coin-management/types";

export interface GetPlatformWalletResponse {
	balance: number;
}

export interface GetPlatformPaymentTransactionsInput extends PaginationInput {
	status?: PaymentStatus;
}

export type GetPlatformPaymentTransactionsResponse =
	GetPaymentTransactionsResponse;

import type {
	GetPaymentTransactionsResponse,
	PaginationInput,
	PaymentStatus,
} from "@/features/wallet/types";

export interface GetPlatformWalletResponse {
	balance: number;
}

export interface GetPlatformPaymentTransactionsInput extends PaginationInput {
	status?: PaymentStatus;
}

export type GetPlatformPaymentTransactionsResponse =
	GetPaymentTransactionsResponse;

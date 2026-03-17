export type CoinTransactionType =
	| "purchase"
	| "session_spend"
	| "session_earning"
	| "appreciation_spend"
	| "appreciation_earning"
	| "article_reward"
	| "signup_bonus"
	| "refund";

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
export type PaymentProvider = "stripe";

export interface GetCoinBalanceResponse {
	coinBalance: number;
	coinValue: number;
}

export interface PaginationInput {
	page?: number;
	limit?: number;
	sort?: "recent" | "old";
}

export interface GetCoinTransactionsInput extends PaginationInput {
	type?: CoinTransactionType;
}

export interface CoinTransaction {
	id: string;
	amount: number;
	type: CoinTransactionType;
	createdAt: string;
}

export interface GetCoinTransactionsResponse {
	items: CoinTransaction[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface GetPaymentTransactionsInput extends PaginationInput {
	status?: PaymentStatus;
}

export interface PaymentTransaction {
	id: string;
	paymentId: string;
	provider: PaymentProvider;
	amount: number;
	currency: string;
	coinsGranted: number;
	createdAt: string;
}

export interface GetPaymentTransactionsResponse {
	items: PaymentTransaction[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface CreateCheckoutSessionInput {
	coins: number;
}

export interface CreateCheckoutSessionResponse {
	paymentId: string;
	url: string | null;
	amount: number;
	currency: string;
	coins: number;
}

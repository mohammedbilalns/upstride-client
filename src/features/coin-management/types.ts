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
	referenceType?: string;
	referenceId?: string;
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
	provider: PaymentProvider;
	providerPaymentId: string;
	amount: number;
	currency: string;
	status: PaymentStatus;
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
	sessionId: string;
	url: string | null;
	amount: number;
	currency: string;
	coins: number;
}

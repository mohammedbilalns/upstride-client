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
export type PaymentProvider = "stripe" | "internal";
export type PaymentPurpose = "coins" | "session";
export type PaymentType = "STRIPE" | "COINS";

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
	transactionOwner: "platform" | "user";
	direction: "credit" | "debit";
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
	direction: "credit" | "debit";
	purpose: PaymentPurpose;
	paymentType: PaymentType;
	createdAt: string;
}

export interface GetPaymentTransactionsResponse {
	items: PaymentTransaction[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
	summary?: {
		effectiveRevenue: number;
	};
}

export interface CreateCheckoutSessionInput {
	coins: number;
	successPath?: string;
	cancelPath?: string;
}

export interface CreateCheckoutSessionResponse {
	paymentId: string;
	url: string | null;
	amount: number;
	currency: string;
	coins: number;
}

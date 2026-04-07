import {
	keepPreviousData,
	queryOptions,
	useQuery,
} from "@tanstack/react-query";
import { platformTransactionsService } from "../services/platform-transactions.service";
import type {
	GetPlatformCoinTransactionsInput,
	GetPlatformPaymentTransactionsInput,
} from "../types";

export const platformWalletQueryOptions = queryOptions({
	queryKey: ["platform-wallet", "balance"],
	queryFn: () => platformTransactionsService.getPlatformWallet(),
});

export const platformCoinTransactionsQueryOptions = (
	params: GetPlatformCoinTransactionsInput,
) =>
	queryOptions({
		queryKey: ["platform-wallet", "coin-transactions", params],
		queryFn: () =>
			platformTransactionsService.getPlatformCoinTransactions(params),
		placeholderData: keepPreviousData,
	});

export const platformPaymentTransactionsQueryOptions = (
	params: GetPlatformPaymentTransactionsInput,
) =>
	queryOptions({
		queryKey: ["platform-wallet", "payment-transactions", params],
		queryFn: () =>
			platformTransactionsService.getPlatformPaymentTransactions(params),
		placeholderData: keepPreviousData,
	});

export const usePlatformWallet = () => useQuery(platformWalletQueryOptions);

export const usePlatformCoinTransactions = (
	params: GetPlatformCoinTransactionsInput,
) => useQuery(platformCoinTransactionsQueryOptions(params));

export const usePlatformPaymentTransactions = (
	params: GetPlatformPaymentTransactionsInput,
) => useQuery(platformPaymentTransactionsQueryOptions(params));

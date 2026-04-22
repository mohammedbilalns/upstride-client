import {
	keepPreviousData,
	queryOptions,
	useQuery,
} from "@tanstack/react-query";
import { coinManagementService } from "../../services/coin.service";
import type {
	GetCoinTransactionsInput,
	GetPaymentTransactionsInput,
} from "../../types";

export const coinBalanceQueryOptions = queryOptions({
	queryKey: ["wallet", "balance"],
	queryFn: () => coinManagementService.getCoinBalance(),
});

export const coinTransactionsQueryOptions = (
	params: GetCoinTransactionsInput,
) =>
	queryOptions({
		queryKey: ["wallet", "coin-transactions", params],
		queryFn: () => coinManagementService.getCoinTransactions(params),
		placeholderData: keepPreviousData,
	});

export const paymentTransactionsQueryOptions = (
	params: GetPaymentTransactionsInput,
) =>
	queryOptions({
		queryKey: ["wallet", "payment-transactions", params],
		queryFn: () => coinManagementService.getPaymentTransactions(params),
		placeholderData: keepPreviousData,
	});

export const useCoinBalance = () => useQuery(coinBalanceQueryOptions);

export const useCoinTransactions = (params: GetCoinTransactionsInput) =>
	useQuery(coinTransactionsQueryOptions(params));

export const usePaymentTransactions = (params: GetPaymentTransactionsInput) =>
	useQuery(paymentTransactionsQueryOptions(params));

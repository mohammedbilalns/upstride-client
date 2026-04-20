import {
	keepPreviousData,
	queryOptions,
	useQuery,
} from "@tanstack/react-query";
import { platformTransactionsService } from "../../services/transactions.service";
import type { GetPlatformPaymentTransactionsInput } from "../../types";

export const platformWalletQueryOptions = queryOptions({
	queryKey: ["platform-wallet", "balance"],
	queryFn: () => platformTransactionsService.getPlatformWallet(),
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

export const usePlatformPaymentTransactions = (
	params: GetPlatformPaymentTransactionsInput,
) => useQuery(platformPaymentTransactionsQueryOptions(params));

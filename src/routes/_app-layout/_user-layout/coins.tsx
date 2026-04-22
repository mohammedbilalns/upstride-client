import { createFileRoute } from "@tanstack/react-router";
import {
	coinBalanceQueryOptions,
	coinTransactionsQueryOptions,
	paymentTransactionsQueryOptions,
} from "@/features/wallet/hooks/queries/useCoinManagement";
import { CoinManagementPage } from "@/features/wallet/pages/CoinManagementPage";
import { CoinManagementSearchSchema } from "@/features/wallet/validators/coin-management-params.schema";

export const Route = createFileRoute("/_app-layout/_user-layout/coins")({
	validateSearch: (search) => CoinManagementSearchSchema.parse(search),
	loaderDeps: ({ search }) => ({ search }),
	loader: async ({ context: { queryClient }, deps: { search } }) => {
		await Promise.all([
			queryClient.ensureQueryData(coinBalanceQueryOptions),
			queryClient.ensureQueryData(
				coinTransactionsQueryOptions({
					page: search.coinPage,
					limit: search.coinLimit,
					sort: search.coinSort,
					type: search.coinType,
				}),
			),
			queryClient.ensureQueryData(
				paymentTransactionsQueryOptions({
					page: search.paymentPage,
					limit: search.paymentLimit,
					sort: search.paymentSort,
					status: search.paymentStatus,
				}),
			),
		]);
	},
	component: CoinManagementPage,
});

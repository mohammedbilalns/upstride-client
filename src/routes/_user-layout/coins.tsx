import { createFileRoute } from "@tanstack/react-router";
import {
	coinBalanceQueryOptions,
	coinTransactionsQueryOptions,
	paymentTransactionsQueryOptions,
} from "@/features/coin-management/hooks/use-coin-management";
import { CoinManagementPage } from "@/features/coin-management/pages/CoinManagementPage";
import { CoinManagementSearchSchema } from "@/features/coin-management/validators/coin-management-params";

export const Route = createFileRoute("/_user-layout/coins")({
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

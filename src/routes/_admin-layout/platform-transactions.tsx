import { createFileRoute } from "@tanstack/react-router";
import {
	platformPaymentTransactionsQueryOptions,
	platformWalletQueryOptions,
} from "@/features/platform-transactions/hooks/use-platform-transactions";
import { PlatformTransactionsPage } from "@/features/platform-transactions/pages/PlatformTransactionsPage";
import {
	type PlatformTransactionsSearch,
	PlatformTransactionsSearchSchema,
} from "@/features/platform-transactions/validators/platform-transactions-params";

export const Route = createFileRoute("/_admin-layout/platform-transactions")({
	validateSearch: (search) => PlatformTransactionsSearchSchema.parse(search),
	loaderDeps: ({ search }) => ({ search }),
	loader: ({ context: { queryClient }, deps: { search } }) => {
		const typedSearch = search as PlatformTransactionsSearch;
		return Promise.all([
			queryClient.ensureQueryData(platformWalletQueryOptions),
			queryClient.ensureQueryData(
				platformPaymentTransactionsQueryOptions({
					page: typedSearch.paymentPage,
					limit: typedSearch.paymentLimit,
					sort: typedSearch.paymentSort,
					status: typedSearch.paymentStatus,
				}),
			),
		]);
	},
	component: PlatformTransactionsPage,
});

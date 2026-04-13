import { useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { PaymentTransactionsTable } from "@/features/coin-management/components/PaymentTransactionsTable";
import { Route } from "@/routes/_admin-layout/platform-transactions";
import {
	usePlatformPaymentTransactions,
	usePlatformWallet,
} from "../hooks/use-platform-transactions";
import type { PlatformTransactionsSearch } from "../validators/platform-transactions-params";

export function PlatformTransactionsPage() {
	const navigate = useNavigate({ from: Route.fullPath });
	const search = Route.useSearch();

	const paymentParams = useMemo(
		() => ({
			page: search.paymentPage,
			limit: search.paymentLimit,
			sort: search.paymentSort,
			status: search.paymentStatus,
		}),
		[
			search.paymentPage,
			search.paymentLimit,
			search.paymentSort,
			search.paymentStatus,
		],
	);

	const { data: wallet } = usePlatformWallet();
	const { data: paymentTransactions, isLoading: paymentLoading } =
		usePlatformPaymentTransactions(paymentParams);

	const parseSortValue = (
		value: string,
	): PlatformTransactionsSearch["paymentSort"] =>
		value === "old" ? "old" : "recent";

	const buildPaymentSearch =
		(
			overrides: Partial<{
				paymentPage: PlatformTransactionsSearch["paymentPage"];
				paymentLimit: PlatformTransactionsSearch["paymentLimit"];
				paymentSort: PlatformTransactionsSearch["paymentSort"];
				paymentStatus?: PlatformTransactionsSearch["paymentStatus"];
			}>,
		) =>
		(prev: PlatformTransactionsSearch): PlatformTransactionsSearch => ({
			...prev,
			...overrides,
		});

	return (
		<div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Platform Transactions
				</h1>
				<p className="text-muted-foreground mt-1">
					Review platform wallet balance and transaction activity.
				</p>
			</div>

			<div className="rounded-xl border bg-card p-5 shadow-sm flex flex-col gap-3">
				<span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
					Platform Balance
				</span>
				<span className="text-3xl font-bold tracking-tight">
					₹
					{(wallet?.balance ?? 0).toLocaleString(undefined, {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					})}
				</span>
				<span className="text-xs text-muted-foreground">
					Balance updates when transactions settle.
				</span>
			</div>

			<div className="rounded-xl border bg-card p-3 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
				<span className="text-sm font-semibold">Payment Transactions</span>
				<div className="flex items-center gap-2 px-2">
					<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
						Sort
					</span>
					<Select
						value={search.paymentSort}
						onValueChange={(value) =>
							navigate({
								search: buildPaymentSearch({
									paymentSort: parseSortValue(value),
									paymentPage: 1,
								}),
							})
						}
					>
						<SelectTrigger className="w-32 h-8 text-xs rounded-lg">
							<SelectValue placeholder="Sort" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="recent">Recent first</SelectItem>
							<SelectItem value="old">Oldest first</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<PaymentTransactionsTable
				isLoading={paymentLoading}
				data={paymentTransactions}
				showCoins={false}
				onPageChange={(page) =>
					navigate({
						search: buildPaymentSearch({ paymentPage: page }),
					})
				}
				onLimitChange={(limit) =>
					navigate({
						search: buildPaymentSearch({
							paymentLimit: limit,
							paymentPage: 1,
						}),
					})
				}
			/>
		</div>
	);
}

import { useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select";
import { PaymentTransactionsTable } from "@/features/wallet/components/PaymentTransactionsTable";
import { Route } from "@/routes/_admin-layout/platform-transactions";
import {
	usePlatformPaymentTransactions,
	usePlatformWallet,
} from "../hooks/queries/usePlatformTransactions";
import type { PlatformTransactionsSearch } from "../validators/platform-transactions-params.schema";

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

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col gap-1 border-l-4 border-l-primary">
					<span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
						Total Platform Balance
					</span>
					<div className="flex items-baseline gap-2">
						<span className="text-3xl font-black tracking-tight text-foreground">
							₹
							{(wallet?.balance ?? 0).toLocaleString(undefined, {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
							})}
						</span>
					</div>
				</div>
			</div>

			<div className="flex items-center justify-between gap-3 pt-4 border-t border-border/40">
				<h2 className="text-xl font-bold tracking-tight">Activity Log</h2>
				<div className="flex items-center gap-3">
					<span className="text-xs font-medium text-muted-foreground">
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
						<SelectTrigger className="w-40 h-10 bg-card rounded-xl">
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

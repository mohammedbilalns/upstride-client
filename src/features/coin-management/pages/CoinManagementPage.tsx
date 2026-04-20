import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { AddBalanceForm } from "@/components/common/AddBalanceForm";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Route } from "@/routes/_app-layout/_user-layout/coins";
import { CoinTransactionsTable } from "../components/CoinTransactionsTable";
import { PaymentTransactionsTable } from "../components/PaymentTransactionsTable";
import {
	useCoinBalance,
	useCoinTransactions,
	usePaymentTransactions,
} from "../hooks/queries/useCoinManagement";
import { coinManagementService } from "../services/coin.service";
import type { CoinManagementSearch } from "../validators/coin-management-params.schema";

const PENDING_BOOKING_STORAGE_KEY = "pending-booking-slot";

export function CoinManagementPage() {
	const navigate = useNavigate({ from: Route.fullPath });
	const search = Route.useSearch();

	const coinParams = useMemo(
		() => ({
			page: search.coinPage,
			limit: search.coinLimit,
			sort: search.coinSort,
			type: search.coinType,
		}),
		[search.coinPage, search.coinLimit, search.coinSort, search.coinType],
	);

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

	const { data: balance } = useCoinBalance();
	const { data: coinTransactions, isLoading: coinLoading } =
		useCoinTransactions(coinParams);
	const { data: paymentTransactions, isLoading: paymentLoading } =
		usePaymentTransactions(paymentParams);

	useEffect(() => {
		if (!balance) return;
		try {
			const raw = localStorage.getItem(PENDING_BOOKING_STORAGE_KEY);
			if (!raw) return;
			const parsed = JSON.parse(raw) as {
				mentorId: string;
				slot: { price: number };
				source?: string;
			};
			if (!parsed?.mentorId || !parsed?.slot) return;
			if (parsed.source !== "mentor") return;
			localStorage.removeItem(PENDING_BOOKING_STORAGE_KEY);
			navigate({
				to: "/mentors/$mentorId",
				params: { mentorId: parsed.mentorId },
			});
		} catch {
			// Ignore storage failures.
		}
	}, [balance, navigate]);

	const handleTabChange = (value: string) => {
		const nextTab = value === "payments" ? "payments" : "coins";
		navigate({
			search: (prev) => ({
				...prev,
				tab: nextTab,
			}),
		});
	};

	const parseSortValue = (value: string): CoinManagementSearch["coinSort"] =>
		value === "old" ? "old" : "recent";

	const buildCoinSearch =
		(
			overrides: Partial<{
				coinPage: CoinManagementSearch["coinPage"];
				coinLimit: CoinManagementSearch["coinLimit"];
				coinSort: CoinManagementSearch["coinSort"];
				coinType?: CoinManagementSearch["coinType"];
			}>,
		) =>
		(prev: CoinManagementSearch): CoinManagementSearch => ({
			...prev,
			tab: "coins" as const,
			...overrides,
		});

	const buildPaymentSearch =
		(
			overrides: Partial<{
				paymentPage: CoinManagementSearch["paymentPage"];
				paymentLimit: CoinManagementSearch["paymentLimit"];
				paymentSort: CoinManagementSearch["paymentSort"];
				paymentStatus?: CoinManagementSearch["paymentStatus"];
			}>,
		) =>
		(prev: CoinManagementSearch): CoinManagementSearch => ({
			...prev,
			tab: "payments" as const,
			...overrides,
		});

	const handleCheckout = async (coins: number) => {
		const session = await coinManagementService.createCheckoutSession({
			coins,
		});
		if (session.url) {
			window.location.href = session.url;
		}
	};

	return (
		<div className="relative">
			<div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-zinc-50 to-transparent dark:from-zinc-950 dark:to-transparent" />
			<div className="container mx-auto px-4 md:px-6 py-8 flex flex-col min-h-screen gap-6 relative">
				<div className="flex flex-col gap-1">
					<h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
						Coin Wallet
					</h1>
					<p className="text-sm text-muted-foreground">
						Manage your balance, transaction history, and top-up your wallet.
					</p>
				</div>

				<div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
					<aside className="lg:w-[350px] shrink-0">
						<div className="lg:sticky top-6 space-y-6">
							<div className="rounded-2xl border border-zinc-200/70 bg-white/70 backdrop-blur-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950/40 p-6 space-y-4">
								<div className="space-y-1">
									<p className="text-xs font-semibold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase leading-none">
										Current Balance
									</p>
									<p className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
										{balance?.coinBalance ?? 0}
									</p>
								</div>

								<div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
									<AddBalanceForm
										onSubmit={handleCheckout}
										coinValue={balance?.coinValue}
										label="Top-up Wallet"
										placeholder="Enter coin amount"
									/>
								</div>
							</div>

							<div className="rounded-2xl border border-zinc-200/70 bg-white/70 backdrop-blur-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950/40 p-4">
								<p className="text-xs text-muted-foreground italic">
									Coins can be used to book sessions with mentors across the
									platform.
								</p>
							</div>
						</div>
					</aside>

					<section className="flex-1 min-w-0 min-h-0 space-y-4">
						<Tabs
							value={search.tab}
							onValueChange={handleTabChange}
							className="space-y-4"
						>
							<div className="rounded-2xl border border-zinc-200/70 bg-white/70 backdrop-blur-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950/40 p-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
								<TabsList className="bg-transparent h-auto p-0 m-0">
									<TabsTrigger
										value="coins"
										className="data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-800 rounded-lg px-4 py-2 text-sm font-medium"
									>
										Coin Transactions
									</TabsTrigger>
									<TabsTrigger
										value="payments"
										className="data-[state=active]:bg-zinc-100 dark:data-[state=active]:bg-zinc-800 rounded-lg px-4 py-2 text-sm font-medium"
									>
										Payment History
									</TabsTrigger>
								</TabsList>

								<div className="flex items-center gap-2 px-2">
									<span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
										Sort
									</span>
									{search.tab === "coins" ? (
										<Select
											value={search.coinSort}
											onValueChange={(value) =>
												navigate({
													search: buildCoinSearch({
														coinSort: parseSortValue(value),
														coinPage: 1,
													}),
												})
											}
										>
											<SelectTrigger className="w-32 h-8 text-xs rounded-lg bg-white/50 dark:bg-zinc-900/50">
												<SelectValue placeholder="Sort" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="recent">Recent</SelectItem>
												<SelectItem value="old">Oldest</SelectItem>
											</SelectContent>
										</Select>
									) : (
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
											<SelectTrigger className="w-32 h-8 text-xs rounded-lg bg-white/50 dark:bg-zinc-900/50">
												<SelectValue placeholder="Sort" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="recent">Recent</SelectItem>
												<SelectItem value="old">Oldest</SelectItem>
											</SelectContent>
										</Select>
									)}
								</div>
							</div>

							<div className="rounded-2xl border border-zinc-200/70 bg-white/70 backdrop-blur-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950/40 p-1">
								<TabsContent
									value="coins"
									className="mt-0 focus-visible:outline-none focus-visible:ring-0"
								>
									<CoinTransactionsTable
										isLoading={coinLoading}
										data={coinTransactions}
										onPageChange={(page: number) =>
											navigate({ search: buildCoinSearch({ coinPage: page }) })
										}
										onLimitChange={(limit: number) =>
											navigate({
												search: buildCoinSearch({
													coinLimit: limit,
													coinPage: 1,
												}),
											})
										}
									/>
								</TabsContent>

								<TabsContent
									value="payments"
									className="mt-0 focus-visible:outline-none focus-visible:ring-0"
								>
									<PaymentTransactionsTable
										isLoading={paymentLoading}
										data={paymentTransactions}
										sessionDebitLabel="Session booking"
										onPageChange={(page: number) =>
											navigate({
												search: buildPaymentSearch({ paymentPage: page }),
											})
										}
										onLimitChange={(limit: number) =>
											navigate({
												search: buildPaymentSearch({
													paymentLimit: limit,
													paymentPage: 1,
												}),
											})
										}
									/>
								</TabsContent>
							</div>
						</Tabs>
					</section>
				</div>
			</div>
		</div>
	);
}

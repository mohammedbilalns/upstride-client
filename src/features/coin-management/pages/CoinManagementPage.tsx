import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { AddBalanceForm } from "@/components/common/AddBalanceForm";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Route } from "@/routes/_user-layout/coins";
import { CoinTransactionsTable } from "../components/CoinTransactionsTable";
import { CoinWalletHeader } from "../components/CoinWalletHeader";
import { PaymentTransactionsTable } from "../components/PaymentTransactionsTable";
import {
	useCoinBalance,
	useCoinTransactions,
	usePaymentTransactions,
} from "../hooks/use-coin-management";
import { coinManagementService } from "../services/coin-management.service";
import type { CoinManagementSearch } from "../validators/coin-management-params";

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
		<div className="p-4 md:p-6 space-y-5 max-w-360 mx-auto animate-in fade-in duration-500">
			<div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
				<CoinWalletHeader />

				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-card p-3 md:p-4 rounded-xl border shadow-sm w-full xl:w-auto">
					<div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-0 px-2 shrink-0">
						<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
							Balance
						</span>
						<span className="text-2xl font-bold tracking-tight text-primary">
							{balance?.coinBalance ?? 0}
						</span>
					</div>
					<div className="w-px h-10 bg-border hidden sm:block"></div>
					<div className="w-full sm:w-auto">
						<AddBalanceForm
							onSubmit={handleCheckout}
							coinValue={balance?.coinValue}
							label="Top-up Amount"
							placeholder="Enter Coins"
						/>
					</div>
				</div>
			</div>

			<Tabs
				value={search.tab}
				onValueChange={handleTabChange}
				className="space-y-4"
			>
				<div className="bg-card p-2 rounded-xl border shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<TabsList className="bg-transparent h-auto p-0 m-0">
						<TabsTrigger
							value="coins"
							className="data-[state=active]:bg-muted dark:data-[state=active]:bg-muted/50 rounded-lg px-4 py-2"
						>
							Coin Transactions
						</TabsTrigger>
						<TabsTrigger
							value="payments"
							className="data-[state=active]:bg-muted dark:data-[state=active]:bg-muted/50 rounded-lg px-4 py-2"
						>
							Payment Transactions
						</TabsTrigger>
					</TabsList>

					<div className="flex items-center gap-2 px-2 pb-2 sm:pb-0">
						<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
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
								<SelectTrigger className="w-35 h-9">
									<SelectValue placeholder="Sort By" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="recent">Recent First</SelectItem>
									<SelectItem value="old">Oldest First</SelectItem>
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
								<SelectTrigger className="w-35 h-9">
									<SelectValue placeholder="Sort By" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="recent">Recent First</SelectItem>
									<SelectItem value="old">Oldest First</SelectItem>
								</SelectContent>
							</Select>
						)}
					</div>
				</div>

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
								search: buildCoinSearch({ coinLimit: limit, coinPage: 1 }),
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
						onPageChange={(page: number) =>
							navigate({ search: buildPaymentSearch({ paymentPage: page }) })
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
			</Tabs>
		</div>
	);
}

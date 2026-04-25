import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/Table";
import { Pagination } from "@/features/users/components/Pagination";
import type { GetPaymentTransactionsResponse } from "../types";
import { TransactionIdCell } from "./TransactionIdCell";

interface PaymentTransactionsTableProps {
	isLoading: boolean;
	data?: GetPaymentTransactionsResponse;
	onPageChange: (page: number) => void;
	onLimitChange: (limit: number) => void;
	showCoins?: boolean;
	sessionDebitLabel?: string;
}

export function PaymentTransactionsTable({
	isLoading,
	data,
	onPageChange,
	onLimitChange,
	showCoins = true,
	sessionDebitLabel = "Session refund",
}: PaymentTransactionsTableProps) {
	return (
		<Card className="bg-card rounded-xl border shadow-sm overflow-hidden">
			<CardContent className="p-0">
				{isLoading ? (
					<div className="py-8 text-center text-muted-foreground">
						Loading transactions...
					</div>
				) : data?.items?.length ? (
					<div className="w-full overflow-x-auto">
						<Table className="w-full table-fixed">
							<TableHeader className="bg-muted/50">
								<TableRow>
									<TableHead className="w-[26%] py-2 pl-3 md:pl-5 text-xs">
										Date
									</TableHead>
									<TableHead className="w-[15%] py-2 text-xs">
										Purpose
									</TableHead>
									{showCoins && (
										<TableHead className="w-[10%] py-2 text-xs">
											Coins
										</TableHead>
									)}
									<TableHead className="w-[10%] py-2 text-xs">
										Direction
									</TableHead>
									<TableHead className="w-[12%] py-2 text-xs">Method</TableHead>
									<TableHead className="w-[12%] py-2 text-xs">Amount</TableHead>
									<TableHead className="hidden md:table-cell w-[15%] py-2 pr-4 md:pr-5 text-xs">
										Reference
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{data.items.map((item) => (
									<TableRow
										key={item.id}
										className="hover:bg-muted/30 transition-colors"
									>
										<TableCell className="whitespace-normal align-top text-xs pl-3 md:pl-5 py-2">
											<div className="space-y-1">
												<div>{new Date(item.createdAt).toLocaleString()}</div>
												<div className="md:hidden font-mono text-[11px] leading-4 break-all text-muted-foreground">
													{item.paymentId}
												</div>
											</div>
										</TableCell>
										<TableCell className="text-xs py-2">
											<Badge variant="outline" className="text-[10px]">
												{item.purpose === "session"
													? item.direction === "debit"
														? sessionDebitLabel
														: "Session spend"
													: "Coin purchase"}
											</Badge>
										</TableCell>
										{showCoins && (
											<TableCell className="text-xs py-2">
												{item.coinsGranted}
											</TableCell>
										)}
										<TableCell className="text-xs py-2">
											{item.direction === "debit" ? (
												<Badge
													variant="outline"
													className="border-rose-500/30 bg-rose-500/10 text-rose-700 font-bold text-[9px] uppercase tracking-tight px-1.5 h-5"
												>
													Debit
												</Badge>
											) : (
												<span className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase tracking-wide">
													Credit
												</span>
											)}
										</TableCell>
										<TableCell className="text-xs py-2">
											<Badge variant="secondary" className="text-[10px]">
												{item.paymentType === "STRIPE" ? "Stripe" : "Coins"}
											</Badge>
										</TableCell>
										<TableCell className="text-xs py-2">
											₹
											{item.amount.toLocaleString(undefined, {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											})}
										</TableCell>
										<TableCell className="hidden md:table-cell align-top text-muted-foreground pr-4 md:pr-5 py-2">
											<TransactionIdCell value={item.paymentId} />
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				) : (
					<div className="py-8 text-center text-muted-foreground">
						No payment transactions yet.
					</div>
				)}
				{data && (
					<div className="p-4 md:p-6 border-t bg-card">
						<Pagination
							currentPage={data.page}
							totalPages={data.totalPages}
							totalItems={data.total}
							limit={data.limit}
							onPageChange={onPageChange}
							onLimitChange={onLimitChange}
						/>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

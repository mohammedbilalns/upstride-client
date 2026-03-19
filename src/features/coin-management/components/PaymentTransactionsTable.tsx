import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/features/user-management/components/Pagination";
import type { GetPaymentTransactionsResponse } from "../types";

interface PaymentTransactionsTableProps {
	isLoading: boolean;
	data?: GetPaymentTransactionsResponse;
	onPageChange: (page: number) => void;
	onLimitChange: (limit: number) => void;
}

export function PaymentTransactionsTable({
	isLoading,
	data,
	onPageChange,
	onLimitChange,
}: PaymentTransactionsTableProps) {
	return (
		<Card className="bg-card rounded-xl border shadow-sm overflow-hidden">
			<CardHeader className="bg-muted/50 border-b py-4">
				<CardTitle className="text-lg">Payment Transactions</CardTitle>
			</CardHeader>
			<CardContent className="p-0">
				{isLoading ? (
					<div className="py-8 text-center text-muted-foreground">
						Loading transactions...
					</div>
				) : data?.items?.length ? (
					<div className="w-full overflow-x-auto">
						<Table className="min-w-[720px] table-fixed">
							<TableHeader className="bg-muted/50">
								<TableRow>
									<TableHead className="w-[28%] py-2 pl-3 md:pl-5 text-xs">
										Date
									</TableHead>
									<TableHead className="w-[14%] py-2 text-xs">Coins</TableHead>
									<TableHead className="w-[14%] py-2 text-xs">
										Direction
									</TableHead>
									<TableHead className="w-[16%] py-2 text-xs">Amount</TableHead>
									<TableHead className="hidden md:table-cell w-[28%] py-2 pr-4 md:pr-5 text-xs">
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
										<TableCell className="whitespace-normal text-xs pl-3 md:pl-5 py-2">
											{new Date(item.createdAt).toLocaleString()}
										</TableCell>
										<TableCell className="text-xs py-2">
											{item.coinsGranted}
										</TableCell>
										<TableCell className="text-xs py-2">
											<Badge
												variant="outline"
												className={
													item.direction === "credit"
														? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
														: "border-rose-500/30 bg-rose-500/10 text-rose-700"
												}
											>
												{item.direction}
											</Badge>
										</TableCell>
										<TableCell className="text-xs py-2">
											₹
											{item.amount.toLocaleString(undefined, {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2,
											})}
										</TableCell>
										<TableCell className="hidden md:table-cell text-muted-foreground font-mono pr-4 md:pr-5 py-2">
											<span title={item.paymentId}>
												{item.paymentId.slice(0, 16)}
											</span>
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

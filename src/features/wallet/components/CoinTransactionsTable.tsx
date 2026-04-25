import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/Table";
import { Pagination } from "@/features/users/components/Pagination";
import type { GetCoinTransactionsResponse } from "../types";
import { TransactionIdCell } from "./TransactionIdCell";

interface CoinTransactionsTableProps {
	isLoading: boolean;
	data?: GetCoinTransactionsResponse;
	onPageChange: (page: number) => void;
	onLimitChange: (limit: number) => void;
}

export function CoinTransactionsTable({
	isLoading,
	data,
	onPageChange,
	onLimitChange,
}: CoinTransactionsTableProps) {
	return (
		<Card className="bg-card rounded-xl border shadow-sm overflow-hidden">
			<CardHeader className="bg-muted/50 border-b py-4">
				<CardTitle className="text-lg">Coin Transactions</CardTitle>
			</CardHeader>
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
									<TableHead className="w-[30%] py-2 pl-3 md:pl-5 text-xs">
										Date
									</TableHead>
									<TableHead className="w-[22%] py-2 text-xs">Type</TableHead>
									<TableHead className="w-[16%] py-2 text-xs">
										Direction
									</TableHead>
									<TableHead className="w-[12%] py-2 text-xs">Amount</TableHead>
									<TableHead className="hidden md:table-cell w-[20%] py-2 pr-4 md:pr-5 text-xs">
										Transaction ID
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
													{item.id}
												</div>
											</div>
										</TableCell>
										<TableCell className="capitalize text-xs py-2">
											{item.type.replaceAll("_", " ")}
										</TableCell>
										<TableCell className="text-xs py-2">
											<Badge
												variant="outline"
												className={
													item.direction === "credit"
														? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
														: "border-rose-500/30 bg-rose-500/10 text-rose-700"
												}
											>
												{item.direction}
											</Badge>
										</TableCell>
										<TableCell className="text-xs py-2">
											{item.amount > 0 ? "+" : ""}
											{item.amount}
										</TableCell>
										<TableCell className="hidden md:table-cell align-top text-muted-foreground pr-4 md:pr-5 py-2">
											<TransactionIdCell value={item.id} />
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				) : (
					<div className="py-8 text-center text-muted-foreground">
						No coin transactions yet.
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

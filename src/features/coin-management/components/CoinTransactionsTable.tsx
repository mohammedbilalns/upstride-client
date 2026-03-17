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
import type { GetCoinTransactionsResponse } from "../types";

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
					<Table className="table-fixed">
						<TableHeader className="bg-muted/50">
							<TableRow>
								<TableHead className="w-[40%] py-3 pl-4 md:pl-6">
									Date
								</TableHead>
								<TableHead className="w-[25%] py-3">Type</TableHead>
								<TableHead className="w-[15%] py-3">Amount</TableHead>
								<TableHead className="hidden md:table-cell py-3 pr-4 md:pr-6">
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
									<TableCell className="whitespace-normal text-xs md:text-sm pl-4 md:pl-6 py-2.5">
										{new Date(item.createdAt).toLocaleString()}
									</TableCell>
									<TableCell className="capitalize text-xs md:text-sm py-2.5">
										{item.type.replaceAll("_", " ")}
									</TableCell>
									<TableCell className="text-xs md:text-sm py-2.5">
										{item.amount > 0 ? "+" : ""}
										{item.amount}
									</TableCell>
									<TableCell className="hidden md:table-cell text-muted-foreground font-mono pr-4 md:pr-6 py-2.5">
										<div
											className="truncate max-w-[150px] lg:max-w-[200px]"
											title={item.id}
										>
											{item.id}
										</div>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
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

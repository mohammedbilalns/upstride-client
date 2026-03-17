import { Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddBalanceForm } from "@/components/common/AddBalanceForm";

interface BalanceCardProps {
	coinBalance: number;
	coinValue?: number;
	onSubmit: (coins: number) => Promise<void>;
}

export function BalanceCard({
	coinBalance,
	coinValue,
	onSubmit,
}: BalanceCardProps) {
	return (
		<Card className="flex-1 bg-card rounded-xl border shadow-sm">
			<CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30 py-4">
				<div>
					<CardTitle className="text-lg font-semibold text-muted-foreground">
						Coin Balance
					</CardTitle>
					<p className="text-3xl font-bold tracking-tight mt-1">
						{coinBalance}
					</p>
				</div>
				<div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
					<Wallet className="h-5 w-5" />
				</div>
			</CardHeader>
			<CardContent>
				<AddBalanceForm onSubmit={onSubmit} coinValue={coinValue} />
			</CardContent>
		</Card>
	);
}

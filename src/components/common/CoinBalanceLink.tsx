import { Link } from "@tanstack/react-router";
import { Coins } from "lucide-react";
import { cn } from "@/shared/utils/cn";

const coinSearchParams = {
	tab: "coins",
	coinPage: 1,
	coinLimit: 10,
	coinSort: "recent",
	paymentPage: 1,
	paymentLimit: 10,
	paymentSort: "recent",
};

export default function CoinBalanceLink({
	coinBalance,
	onNavigate,
	className,
}: {
	coinBalance: number;
	onNavigate?: () => void;
	className?: string;
}) {
	return (
		<Link
			to="/coins"
			search={coinSearchParams}
			onClick={onNavigate}
			className={cn(
				"flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs md:text-sm font-semibold text-foreground hover:border-primary/40 hover:text-primary transition-colors",
				className,
			)}
		>
			<Coins className="h-3.5 w-3.5 md:h-4 md:w-4 text-primary" />
			<span className="tabular-nums">{coinBalance}</span>
		</Link>
	);
}

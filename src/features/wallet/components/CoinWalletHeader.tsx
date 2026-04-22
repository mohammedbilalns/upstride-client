export function CoinWalletHeader() {
	return (
		<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
			<div>
				<h1 className="text-3xl font-bold tracking-tight">Coin Wallet</h1>
				<p className="text-muted-foreground mt-1">
					View your balance, transaction history, and top-up your wallet.
				</p>
			</div>
		</div>
	);
}

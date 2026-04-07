export function RuleManagementHeader() {
	return (
		<div className="flex flex-col gap-2">
			<h1 className="text-3xl font-bold tracking-tight">Availability Rules</h1>
			<p className="text-muted-foreground">
				Define your recurring weekly availability. The system will automatically
				compute accurate booking slots based on these configured rules, break
				times, and session durations.
			</p>
		</div>
	);
}

import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { cn } from "@/shared/utils/cn";
import type { SessionsSearch } from "../validators/sessions-params.schema";

interface SessionFiltersProps {
	search: SessionsSearch;
	onUpdate: (updates: Partial<SessionsSearch>) => void;
	onClear: () => void;
}

const filterGroups = {
	upcoming: [
		{ value: "upcoming", label: "Scheduled", hint: "All upcoming sessions" },
		{
			value: "payment_pending",
			label: "Needs payment",
			hint: "Sessions waiting on payment",
		},
		{
			value: "upcoming_cancelled",
			label: "Cancelled",
			hint: "Upcoming sessions that were cancelled",
		},
	],
	past: [
		{ value: "completed", label: "Completed", hint: "Finished sessions" },
		{
			value: "past_cancelled",
			label: "Cancelled",
			hint: "Past sessions that were cancelled",
		},
	],
} as const;

const defaultFilterByTab = {
	upcoming: "upcoming",
	past: "completed",
} as const;

export function SessionFilters({
	search,
	onUpdate,
	onClear,
}: SessionFiltersProps) {
	const hasFilters =
		search.tab !== "upcoming" ||
		search.filter !== defaultFilterByTab[search.tab] ||
		search.page !== 1;

	const filters = filterGroups[search.tab];

	return (
		<div className="space-y-4">
			<div className="rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950/40 p-4 space-y-4">
				<div className="space-y-1">
					<p className="text-xs font-semibold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">
						Timeframe
					</p>
					{/* <p className="text-sm text-zinc-600 dark:text-zinc-300"> */}
					{/* 	Switch between upcoming and past sessions, then narrow by status. */}
					{/* </p> */}
				</div>

				<Tabs
					value={search.tab}
					onValueChange={(tab) =>
						onUpdate({
							tab: tab as "upcoming" | "past",
							filter: defaultFilterByTab[tab as "upcoming" | "past"],
							page: 1,
						})
					}
					className="w-full"
				>
					<TabsList className="grid w-full grid-cols-2 bg-zinc-100/60 dark:bg-zinc-900/50">
						<TabsTrigger value="upcoming" className="text-xs">
							Upcoming
						</TabsTrigger>
						<TabsTrigger value="past" className="text-xs">
							Past
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			<div className="rounded-2xl border border-zinc-200/70 bg-white/80 backdrop-blur-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950/40 p-4 space-y-3">
				<div className="flex items-center justify-between gap-3">
					<p className="text-xs font-semibold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">
						Quick filters
					</p>
					<span className="text-[11px] text-zinc-500 dark:text-zinc-400">
						{search.tab === "upcoming" ? "Upcoming sessions" : "Past sessions"}
					</span>
				</div>

				<div className="flex flex-wrap gap-2">
					{filters.map((item) => {
						const active = search.filter === item.value;
						return (
							<button
								key={item.value}
								type="button"
								onClick={() =>
									onUpdate({
										filter: item.value,
										page: 1,
									})
								}
								className={cn(
									"rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
									active
										? "border-primary bg-primary/10 text-primary"
										: "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950/20 dark:text-zinc-300 dark:hover:text-zinc-50",
								)}
								title={item.hint}
							>
								{item.label}
							</button>
						);
					})}
				</div>
			</div>

			{hasFilters && (
				<Button
					variant="ghost"
					size="sm"
					onClick={onClear}
					className="h-9 w-full justify-start text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 gap-2 mt-2"
				>
					<X className="h-4 w-4" />
					Clear filters
				</Button>
			)}
		</div>
	);
}

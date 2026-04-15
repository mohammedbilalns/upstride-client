import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SessionsSearch } from "../validators/sessions-params";

interface SessionFiltersProps {
	search: SessionsSearch;
	onUpdate: (updates: Partial<SessionsSearch>) => void;
	onClear: () => void;
}

export function SessionFilters({
	search,
	onUpdate,
	onClear,
}: SessionFiltersProps) {
	const hasFilters =
		search.tab !== "upcoming" ||
		search.upcomingFilter !== "upcoming" ||
		search.pastFilter !== "completed" ||
		search.page !== 1;

	return (
		<div className="space-y-6">
			{/* Timeframe Filter */}
			<div className="rounded-2xl border border-zinc-200/70 bg-white/70 backdrop-blur-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950/40 p-4 space-y-4">
				<div className="flex items-center justify-between">
					<p className="text-xs font-semibold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">
						Timeframe
					</p>
				</div>

				<Tabs
					value={search.tab}
					onValueChange={(val) =>
						onUpdate({
							tab: val as "upcoming" | "past",
							page: 1,
							...(val === "past"
								? { pastFilter: "completed" as const }
								: { upcomingFilter: "upcoming" as const }),
						})
					}
					className="w-full"
				>
					<TabsList className="w-full grid grid-cols-2 bg-zinc-100/50 dark:bg-zinc-900/50">
						<TabsTrigger value="upcoming" className="text-xs">
							Upcoming
						</TabsTrigger>
						<TabsTrigger value="past" className="text-xs">
							Past
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			{/* Status Filter */}
			{search.tab === "upcoming" && (
				<div className="rounded-2xl border border-zinc-200/70 bg-white/70 backdrop-blur-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950/40 p-4 space-y-3">
					<p className="text-xs font-semibold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">
						Status
					</p>
					<div className="space-y-2">
						<Select
							value={search.upcomingFilter}
							onValueChange={(val) =>
								onUpdate({
									upcomingFilter: val as
										| "upcoming"
										| "cancelled"
										| "payment_pending",
									page: 1,
								})
							}
						>
							<SelectTrigger className="h-10 rounded-xl bg-white/60 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800">
								<SelectValue placeholder="Filter by status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="upcoming">Active Sessions</SelectItem>
								<SelectItem value="payment_pending">Payment Pending</SelectItem>
								<SelectItem value="cancelled">Cancelled</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			)}

			{search.tab === "past" && (
				<div className="rounded-2xl border border-zinc-200/70 bg-white/70 backdrop-blur-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950/40 p-4 space-y-3">
					<p className="text-xs font-semibold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">
						Status
					</p>
					<div className="space-y-2">
						<Select
							value={search.pastFilter}
							onValueChange={(val) =>
								onUpdate({
									pastFilter: val as "completed" | "cancelled",
									page: 1,
								})
							}
						>
							<SelectTrigger className="h-10 rounded-xl bg-white/60 dark:bg-zinc-950/40 border-zinc-200 dark:border-zinc-800">
								<SelectValue placeholder="Filter by status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="completed">Completed</SelectItem>
								<SelectItem value="cancelled">Cancelled</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			)}

			{/* Unified Clear Filters Button */}
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

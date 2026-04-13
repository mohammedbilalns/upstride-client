import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { AvailabilityRule } from "@/features/availability-management/types";
import { AvailabilityRuleCard } from "./AvailabilityRuleCard";

interface AvailabilityRulesSectionProps {
	availabilityFilter: "active" | "expired";
	statusFilter: "all" | "disabled";
	onSetAvailabilityFilter: (value: "active" | "expired") => void;
	onToggleDisabledFilter: () => void;
	rules: AvailabilityRule[];
	isLoading: boolean;
	isFetching: boolean;
	hasMore: boolean;
	onLoadMore: () => void;
	onDisableRule: (ruleId: string) => void;
	onEnableRule: (ruleId: string) => void;
}

export function AvailabilityRulesSection({
	availabilityFilter,
	statusFilter,
	onSetAvailabilityFilter,
	onToggleDisabledFilter,
	rules,
	isLoading,
	isFetching,
	hasMore,
	onLoadMore,
	onDisableRule,
	onEnableRule,
}: AvailabilityRulesSectionProps) {
	return (
		<div className="space-y-4">
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
				<h2 className="text-xl font-semibold flex items-center gap-2">
					<CalendarIcon className="h-5 w-5" />
					Current Rules
				</h2>
				<div className="flex items-center gap-2">
					<Button
						type="button"
						variant={
							availabilityFilter === "active" && statusFilter !== "disabled"
								? "default"
								: "outline"
						}
						size="sm"
						onClick={() => onSetAvailabilityFilter("active")}
					>
						Active
					</Button>
					<Button
						type="button"
						variant={availabilityFilter === "expired" ? "default" : "outline"}
						size="sm"
						onClick={() => onSetAvailabilityFilter("expired")}
					>
						Expired
					</Button>
					<Button
						type="button"
						variant={statusFilter === "disabled" ? "default" : "outline"}
						size="sm"
						onClick={onToggleDisabledFilter}
					>
						Disabled Only
					</Button>
				</div>
			</div>
			{isLoading ? (
				<div className="p-8 text-center text-muted-foreground animate-pulse">
					Loading rules...
				</div>
			) : rules.length === 0 ? (
				<Card className="border-dashed border-2 flex flex-col items-center justify-center p-12 text-center">
					<Clock className="h-12 w-12 text-muted-foreground/30 mb-4" />
					<p className="text-muted-foreground font-medium">
						No availability rules defined yet.
					</p>
					<p className="text-sm text-muted-foreground">
						Add a rule above to start receiving bookings.
					</p>
				</Card>
			) : (
				<div className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{rules.map((rule) => (
							<AvailabilityRuleCard
								key={rule.id}
								rule={rule}
								onDisable={onDisableRule}
								onEnable={onEnableRule}
							/>
						))}
					</div>
					{hasMore && (
						<div className="flex justify-center">
							<Button
								type="button"
								variant="outline"
								disabled={isFetching}
								onClick={onLoadMore}
							>
								{isFetching ? "Loading..." : "View more"}
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

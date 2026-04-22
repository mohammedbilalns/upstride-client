import { Clock, Power } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { AvailabilityRule } from "@/features/availability/types";
import { cn } from "@/shared/utils/cn";
import { formatDateDmyShort } from "@/shared/utils/date";

interface AvailabilityRuleCardProps {
	rule: AvailabilityRule;
	onDisable: (ruleId: string) => void;
	onEnable: (ruleId: string) => void;
}

export function AvailabilityRuleCard({
	rule,
	onDisable,
	onEnable,
}: AvailabilityRuleCardProps) {
	const active = rule.status;

	return (
		<Card
			className={cn(
				"border-border/60 shadow-sm transition-all flex flex-col hover:shadow-md",
				!active && "opacity-60 bg-muted/20 border-dashed",
			)}
		>
			<CardHeader className="pb-3 border-b bg-muted/10">
				<div className="flex justify-between items-start">
					<div>
						<CardTitle className="text-base line-clamp-1">
							{rule.name}
						</CardTitle>
						<p className="text-xs text-muted-foreground mt-1 line-clamp-2 min-h-8">
							{rule.description || "No description provided."}
						</p>
					</div>
					<Badge
						variant={active ? "default" : "secondary"}
						className="shrink-0 ml-2"
					>
						{active ? "Active" : "Disabled"}
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="p-4 flex-1 space-y-4 text-sm">
				<div className="space-y-1.5 border-b pb-3">
					<div className="flex justify-between">
						<span className="text-muted-foreground">Valid Period:</span>
						<span className="font-medium text-right">
							{formatDateDmyShort(rule.startDate)} to{" "}
							{formatDateDmyShort(rule.endDate)}
						</span>
					</div>
					<div className="flex justify-between">
						<span className="text-muted-foreground">Daily Window:</span>
						<span className="font-medium">
							{rule.startTime} - {rule.endTime}
						</span>
					</div>
					<div className="flex justify-between">
						<span className="text-muted-foreground">Session / Buffer:</span>
						<span className="font-medium">
							{rule.slotDuration}m / {rule.bufferTime}m
						</span>
					</div>
				</div>

				<div>
					<span className="text-muted-foreground block mb-2 text-xs uppercase tracking-wider font-semibold">
						Active Days
					</span>
					<div className="flex flex-wrap gap-1">
						{rule.days.map((d) => (
							<Badge
								key={d}
								variant="outline"
								className="bg-background text-xs font-normal px-2 py-0.5"
							>
								{d.substring(0, 3)}
							</Badge>
						))}
					</div>
				</div>

				{rule.breakTimes && rule.breakTimes.length > 0 && (
					<div>
						<span className="text-muted-foreground block mb-2 text-xs uppercase tracking-wider font-semibold">
							Break Times
						</span>
						<div className="space-y-1">
							{rule.breakTimes.map((bt) => (
								<div
									key={`${bt.startTime}-${bt.endTime}`}
									className="text-xs flex items-center gap-1.5"
								>
									<Clock className="w-3 h-3" /> {bt.startTime} - {bt.endTime}
								</div>
							))}
						</div>
					</div>
				)}
			</CardContent>
			<div className="p-3 border-t bg-muted/5 flex justify-end gap-2 shrink-0">
				{active ? (
					<Button
						variant="ghost"
						size="sm"
						className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 w-full justify-center"
						onClick={() => onDisable(rule.id)}
					>
						<Power className="h-4 w-4 mr-2" /> Disable Rule
					</Button>
				) : (
					<Button
						variant="ghost"
						size="sm"
						className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 w-full justify-center"
						onClick={() => onEnable(rule.id)}
					>
						<Power className="h-4 w-4 mr-2" /> Enable Rule
					</Button>
				)}
			</div>
		</Card>
	);
}

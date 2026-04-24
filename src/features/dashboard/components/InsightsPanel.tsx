import { BookOpen, Flame, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { DashboardRole, DashboardTopCategoryDto } from "../types";
import { formatNumber } from "../utils/dashboard.formatters";

interface InsightsPanelProps {
	dashboardRole: DashboardRole;
	consistentLoginDays: number;
	topCategory: DashboardTopCategoryDto | null | undefined;
	averageRating?: number;
}

export function InsightsPanel({
	dashboardRole,
	consistentLoginDays,
	topCategory,
	averageRating,
}: InsightsPanelProps) {
	return (
		<Card className="gap-0 border-border/60 shadow-sm">
			<CardHeader>
				<CardTitle className="text-lg">Insights</CardTitle>
			</CardHeader>
			<CardContent className="space-y-2">
				<div className="rounded-2xl border border-border/60 bg-muted/20 p-3">
					<div className="flex items-start gap-3">
						<div className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500">
							<Flame className="h-4.5 w-4.5" />
						</div>
						<div>
							<p className="text-xs text-muted-foreground">
								Consistency streak
							</p>
							<p className="text-base font-semibold">
								{consistentLoginDays} days in a row
							</p>
						</div>
					</div>
				</div>
				<div className="rounded-2xl border border-border/60 bg-muted/20 p-3">
					<div className="flex items-start gap-3">
						<div className="rounded-xl bg-violet-500/10 p-2 text-violet-500">
							<BookOpen className="h-4.5 w-4.5" />
						</div>
						<div className="min-w-0">
							<p className="text-xs text-muted-foreground">Top category</p>
							<p className="truncate text-base font-semibold">
								{topCategory?.name ?? "No category yet"}
							</p>
							{topCategory && (
								<p className="text-xs text-muted-foreground">
									{topCategory.count} sessions
								</p>
							)}
						</div>
					</div>
				</div>
				{dashboardRole === "MENTOR" && (
					<div className="rounded-2xl border border-border/60 bg-muted/20 p-3">
						<div className="flex items-start gap-3">
							<div className="rounded-xl bg-amber-500/10 p-2 text-amber-500">
								<Star className="h-4.5 w-4.5" />
							</div>
							<div>
								<p className="text-xs text-muted-foreground">
									Current average rating
								</p>
								<p className="text-base font-semibold">
									{formatNumber(averageRating ?? 4.8, 1)}
								</p>
							</div>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

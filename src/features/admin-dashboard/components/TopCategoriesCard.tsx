import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";
import type { AdminDashboardResponse } from "../types";
import { formatCompact } from "../utils";

interface TopCategoriesCardProps {
	categories: AdminDashboardResponse["topCategories"];
}

export function TopCategoriesCard({ categories }: TopCategoriesCardProps) {
	return (
		<Card className="gap-0 border-border/70 bg-card/95 shadow-sm">
			<CardHeader className="px-4 pt-4">
				<CardTitle className="text-lg">Top Categories By Sessions</CardTitle>
				<CardDescription>Session distribution by expertise</CardDescription>
			</CardHeader>
			<CardContent className="px-4 pb-4">
				<div className="space-y-3">
					{categories.map((category) => (
						<div key={category.categoryId} className="space-y-2">
							<div className="flex items-center justify-between text-sm">
								<span>{category.name}</span>
								<span className="text-muted-foreground">
									{formatCompact(category.sessions)} (
									{category.sharePercent.toFixed(1)}%)
								</span>
							</div>
							<div className="h-2 overflow-hidden rounded-full bg-muted">
								<div
									className="h-full rounded-full bg-linear-to-r from-primary to-sky-500"
									style={{
										width: `${Math.max(category.sharePercent, 6)}%`,
									}}
								/>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

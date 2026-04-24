import { Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatDateShort } from "@/shared/utils/date";
import type { DashboardReviewDto } from "../types";
import { formatNumber } from "../utils/dashboard.formatters";

interface ReviewsPanelProps {
	reviews: DashboardReviewDto[];
	rating: number;
}

export function ReviewsPanel({ reviews, rating }: ReviewsPanelProps) {
	return (
		<Card className="gap-0 border-border/60 shadow-sm">
			<CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
				<div className="space-y-1">
					<CardTitle className="text-lg">Recent Reviews</CardTitle>
					<p className="text-xs text-muted-foreground">
						Recent feedback from completed sessions.
					</p>
				</div>
				<Badge variant="secondary" className="h-7 px-2.5 text-[11px]">
					Dummy data
				</Badge>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="space-y-2.5">
					{reviews.map((review) => (
						<div
							key={review.id}
							className="rounded-2xl border border-border/60 p-3.5"
						>
							<div className="flex items-center justify-between gap-3">
								<p className="font-medium">{review.reviewerName}</p>
								<div className="flex items-center gap-1 text-amber-500">
									<Star className="h-4 w-4 fill-current" />
									<span className="text-sm font-semibold">{review.rating}</span>
								</div>
							</div>
							<p className="mt-2 text-xs text-muted-foreground">
								{review.comment}
							</p>
							<p className="mt-2 text-xs text-muted-foreground">
								{formatDateShort(review.createdAt)}
							</p>
						</div>
					))}
				</div>
				<div className="flex items-end justify-between rounded-2xl border border-border/60 bg-muted/20 p-3.5">
					<div>
						<p className="text-xs text-muted-foreground">
							Total average rating
						</p>
						<p className="text-2xl font-semibold">{formatNumber(rating, 1)}</p>
					</div>
					<div className="flex items-center gap-1 text-amber-500">
						{[1, 2, 3, 4, 5].map((star) => (
							<Star key={`star-${star}`} className="h-4 w-4 fill-current" />
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

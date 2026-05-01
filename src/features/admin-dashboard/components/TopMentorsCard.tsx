import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";
import type { AdminDashboardResponse } from "../types";
import { currency, percent } from "../utils";

interface TopMentorsCardProps {
	mentors: AdminDashboardResponse["topMentors"];
}

export function TopMentorsCard({ mentors }: TopMentorsCardProps) {
	return (
		<Card className="gap-0 border-border/70 bg-card/95 shadow-sm">
			<CardHeader className="px-4 pt-4">
				<CardTitle className="text-lg">Top Mentors By Revenue</CardTitle>
				<CardDescription>Current top earning mentors</CardDescription>
			</CardHeader>
			<CardContent className="px-4 pb-4">
				<div className="space-y-2.5">
					{mentors.map((mentor, index) => (
						<div
							key={mentor.mentorId}
							className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 px-3 py-2.5"
						>
							<div className="flex items-center gap-3">
								<span className="text-sm text-muted-foreground">
									{index + 1}
								</span>
								<div>
									<p className="text-sm font-medium">{mentor.name}</p>
									<p className="text-xs text-emerald-500">
										{percent(mentor.changePercent)}
									</p>
								</div>
							</div>
							<p className="text-sm font-semibold">
								{currency.format(mentor.revenue)}
							</p>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

import { Link } from "@tanstack/react-router";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BookingDto } from "@/features/session-booking-management/types";
import { formatDateShort, formatTimeShort } from "@/shared/utils/date";

export function UpcomingSessionsWidget({
	upcomingLoading,
	upcomingItems,
}: {
	upcomingLoading: boolean;
	upcomingItems: BookingDto[];
}) {
	return (
		<Card className="border-border/60 shadow-sm">
			<CardHeader className="flex items-center justify-between flex-row">
				<CardTitle className="text-xl">Upcoming Sessions</CardTitle>
				<Button variant="ghost" size="sm" asChild>
					<Link
						to="/mentor-sessions"
						search={{ filter: "upcoming", page: 1, limit: 10 }}
						className="flex items-center gap-2"
					>
						View all <ArrowRight className="h-4 w-4" />
					</Link>
				</Button>
			</CardHeader>
			<CardContent className="space-y-3">
				{upcomingLoading && (
					<p className="text-sm text-muted-foreground">Loading sessions...</p>
				)}
				{!upcomingLoading && upcomingItems.length === 0 && (
					<div className="border border-dashed border-border/60 rounded-xl p-6 text-center text-sm text-muted-foreground">
						No upcoming sessions scheduled.
					</div>
				)}
				<div className="space-y-3">
					{upcomingItems.map((session) => (
						<div
							key={session.id}
							className="flex items-center justify-between rounded-lg border border-border/60 p-3"
						>
							<div className="space-y-1">
								<div className="flex items-center gap-2 text-sm font-semibold">
									<Calendar className="h-4 w-4 text-primary" />
									{formatDateShort(session.startTime)}
								</div>
								<div className="flex items-center gap-2 text-xs text-muted-foreground">
									<Clock className="h-4 w-4" />
									{formatTimeShort(session.startTime)} -{" "}
									{formatTimeShort(session.endTime)}
								</div>
							</div>
							<Badge variant="secondary">{session.status}</Badge>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

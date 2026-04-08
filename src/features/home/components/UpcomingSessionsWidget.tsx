import { Clock } from "lucide-react";
import type { BookingDto } from "@/features/session-booking-management/types";
import { Link } from "@tanstack/react-router";

interface UpcomingSessionsWidgetProps {
	sessions?: BookingDto[];
}

export function UpcomingSessionsWidget({
	sessions = [],
}: UpcomingSessionsWidgetProps) {
	return (
		<div className="rounded-xl bg-card border border-border p-6 flex flex-col space-y-4">
			<h3 className="font-semibold text-lg">Upcoming Sessions</h3>
			{sessions.length === 0 ? (
				<div className="flex flex-col items-center justify-center text-center py-6 text-muted-foreground space-y-2">
					<Clock className="h-8 w-8 opacity-50" />
					<span className="text-sm">No upcoming sessions.</span>
				</div>
			) : (
				<div className="space-y-3">
					{sessions.map((session) => (
						<div
							key={session.id}
							className="rounded-lg bg-muted/50 p-4 border border-border/50 flex flex-col space-y-3"
						>
							<div className="flex justify-between items-start">
								<div>
									<h4 className="font-semibold text-sm">
										{session.mentorName || "Unknown Mentor"}
									</h4>
								</div>
								<span className="bg-primary/20 text-primary text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
									Upcoming
								</span>
							</div>
							<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
								<Clock className="h-3.5 w-3.5" />
								<span>
									{new Date(session.startTime).toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit",
									})}
									{" - "}
									{new Date(session.endTime).toLocaleTimeString([], {
										hour: "2-digit",
										minute: "2-digit",
									})}
								</span>
							</div>
						</div>
					))}
				</div>
			)}
			{sessions.length > 0 && (
				<Link
					to="/sessions"
					search={{
						tab: "upcoming",
						page: 1,
						limit: 12,
						upcomingFilter: "upcoming",
					}}
					className="text-sm text-primary font-medium hover:underline pt-2 text-center"
				>
					View More
				</Link>
			)}
		</div>
	);
}

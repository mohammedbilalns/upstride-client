import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Clock3, Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatDateShort, formatTimeShort } from "@/shared/utils/date";
import type { DashboardRole, DashboardSummary } from "../types";
import { formatMoney } from "../utils/dashboard.formatters";

interface UpcomingSessionsPanelProps {
	dashboardRole: DashboardRole;
	sessions: DashboardSummary["upcomingSessions"];
}

export function UpcomingSessionsPanel({
	dashboardRole,
	sessions,
}: UpcomingSessionsPanelProps) {
	return (
		<Card className="gap-0 border-border/60 shadow-sm">
			<CardHeader className="flex flex-row items-center justify-between gap-3 pb-2">
				<div className="space-y-1">
					<CardTitle className="text-lg">Upcoming Sessions</CardTitle>
					<p className="text-xs text-muted-foreground">
						Your next two {dashboardRole === "MENTOR" ? "mentoring" : "booked"}{" "}
						sessions.
					</p>
				</div>
				<Button variant="ghost" size="sm" asChild className="h-8 px-2.5">
					<Link
						to={dashboardRole === "MENTOR" ? "/mentor-sessions" : "/sessions"}
						search={
							dashboardRole === "MENTOR"
								? { filter: "upcoming", page: 1, limit: 10 }
								: {
										tab: "upcoming",
										page: 1,
										limit: 12,
										upcomingFilter: "upcoming",
										pastFilter: "completed",
									}
						}
					>
						View all <ArrowRight className="h-4 w-4" />
					</Link>
				</Button>
			</CardHeader>
			<CardContent className="space-y-2">
				{sessions.length === 0 ? (
					<div className="rounded-2xl border border-dashed border-border/60 p-4 text-center text-sm text-muted-foreground">
						No upcoming sessions scheduled.
					</div>
				) : (
					<div className="space-y-2">
						{sessions.map((session) => {
							const counterpart =
								dashboardRole === "MENTOR"
									? (session.menteeName ?? "Learner")
									: (session.mentorName ?? "Mentor");

							return (
								<div
									key={session.id}
									className="flex flex-col gap-2.5 rounded-2xl border border-border/60 bg-muted/20 p-3 md:flex-row md:items-center md:justify-between"
								>
									<div className="space-y-1">
										<div className="flex items-center gap-2 text-sm font-semibold">
											<Users className="h-3.5 w-3.5 text-primary" />
											<span>{counterpart}</span>
										</div>
										<div className="flex items-center gap-2 text-[11px] text-muted-foreground">
											<CalendarDays className="h-3.5 w-3.5" />
											<span>{formatDateShort(session.startTime)}</span>
										</div>
										<div className="flex items-center gap-2 text-[11px] text-muted-foreground">
											<Clock3 className="h-3.5 w-3.5" />
											<span>
												{formatTimeShort(session.startTime)} -{" "}
												{formatTimeShort(session.endTime)}
											</span>
										</div>
									</div>
									<div className="flex flex-col items-start gap-1.5 md:items-end">
										<Badge variant="secondary">
											{session.status.replaceAll("_", " ")}
										</Badge>
										<p className="text-sm font-medium">
											{formatMoney(session.totalAmount, session.currency)}
										</p>
										{dashboardRole === "USER" ? (
											<Button asChild size="sm" className="h-8 px-3">
												<Link
													to="/sessions/$sessionId"
													params={{ sessionId: session.id }}
												>
													View
												</Link>
											</Button>
										) : (
											<Button
												asChild
												size="sm"
												variant="secondary"
												className="h-8 px-3"
											>
												<Link
													to="/mentor-sessions"
													search={{ filter: "upcoming", page: 1, limit: 10 }}
												>
													Open sessions
												</Link>
											</Button>
										)}
									</div>
								</div>
							);
						})}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

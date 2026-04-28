import type { LucideIcon } from "lucide-react";
import { Bookmark, CalendarDays, CheckCircle2 } from "lucide-react";
import type { DashboardActivityItem, DashboardRole } from "../types";

export const DASHBOARD_ROLE_LABELS: Record<DashboardRole, string> = {
	USER: "Learner",
	MENTOR: "Mentor",
};

export const DASHBOARD_TONE_CLASSES = {
	blue: "bg-sky-500/10 text-sky-500",
	violet: "bg-violet-500/10 text-violet-500",
	emerald: "bg-emerald-500/10 text-emerald-500",
	amber: "bg-amber-500/10 text-amber-500",
	rose: "bg-rose-500/10 text-rose-500",
	slate: "bg-slate-500/10 text-slate-500",
} as const;

export const DASHBOARD_ACTIVITY_ICON: Record<
	DashboardActivityItem["type"],
	LucideIcon
> = {
	SESSION_BOOKED: CalendarDays,
	SESSION_COMPLETED: CheckCircle2,
	SAVED_MENTOR: Bookmark,
};

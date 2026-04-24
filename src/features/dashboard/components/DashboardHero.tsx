import type { DashboardRole } from "../types";
import { DASHBOARD_ROLE_LABELS } from "../utils/dashboard.constants";

interface DashboardHeroProps {
	displayName: string;
	dashboardRole: DashboardRole;
	sessionLabel?: string;
	highlights?: Array<{
		label: string;
		value: string;
		subtitle?: string;
	}>;
}

export function DashboardHero({
	displayName,
	dashboardRole,
	sessionLabel,
	highlights = [],
}: DashboardHeroProps) {
	return (
		<div className="relative overflow-hidden rounded-[1.75rem] border border-border/60 bg-linear-to-br from-card via-card to-muted/30 p-4 md:p-5 shadow-sm">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.08),transparent_28%)]" />
			<div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
				<div className="flex max-w-3xl flex-col gap-2">
					<p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
						{DASHBOARD_ROLE_LABELS[dashboardRole]} dashboard
					</p>
					<div className="flex flex-wrap items-center gap-2.5">
						<h1 className="text-2xl md:text-[2rem] font-semibold tracking-tight">
							Welcome back, {displayName}
						</h1>
						{sessionLabel && (
							<span className="rounded-full border border-border/60 bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm">
								{sessionLabel}
							</span>
						)}
					</div>
					<p className="max-w-2xl text-sm text-muted-foreground">
						Track your sessions, activity, articles, and momentum from one
						place.
					</p>
				</div>
				{highlights.length > 0 && (
					<div className="grid w-full gap-2 sm:grid-cols-2 lg:max-w-xl lg:grid-cols-3">
						{highlights.map((highlight) => (
							<div
								key={highlight.label}
								className="rounded-2xl border border-border/60 bg-background/70 p-3 shadow-sm backdrop-blur"
							>
								<p className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
									{highlight.label}
								</p>
								<p className="mt-1 text-base font-semibold leading-none md:text-lg">
									{highlight.value}
								</p>
								{highlight.subtitle && (
									<p className="mt-1 text-xs text-muted-foreground">
										{highlight.subtitle}
									</p>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

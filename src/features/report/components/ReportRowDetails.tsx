import { format } from "date-fns";
import { Badge } from "@/components/ui/Badge";
import { formatDateShort, formatTimeWithSeconds24 } from "@/shared/utils/date";
import type { Report } from "../types";

interface ReportRowDetailsProps {
	report: Report;
}

export function ReportRowDetails({ report }: ReportRowDetailsProps) {
	return (
		<div className="flex flex-col animate-in fade-in slide-in-from-top-2 duration-200">
			<div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-0">
				{/* Reporter Section - Aligned with Target Content */}
				<div className="p-8 border-r border-border/10 space-y-4">
					<div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider pl-2 border-l-2 border-amber-500/50">
						Reporter's Case
					</div>
					<div className="bg-muted/20 rounded-lg p-5 border border-border/50 shadow-sm">
						<div className="flex justify-between items-start gap-4 mb-3">
							<span className="text-sm font-bold text-foreground">
								{report.reason}
							</span>
							<div className="flex flex-col items-end text-[10px] text-muted-foreground/60 font-medium whitespace-nowrap">
								<span className="flex items-center gap-1">
									{formatDateShort(report.createdAt)}
								</span>
								<span className="flex items-center gap-1">
									{formatTimeWithSeconds24(report.createdAt)}
								</span>
							</div>
						</div>
						<p className="text-sm text-muted-foreground leading-relaxed">
							{report.description ||
								"No additional description provided by the reporter."}
						</p>
					</div>
				</div>

				{/* Appeal Section - Aligned with Reporter Column */}
				<div className="p-8 space-y-4 flex-1">
					{report.isAppealSubmitted ? (
						<div className="space-y-4">
							<div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider pl-2 border-l-2 border-blue-500/50">
								Author's Appeal
							</div>
							<div className="bg-blue-50/20 dark:bg-blue-900/5 rounded-lg p-5 border border-blue-200/20 dark:border-blue-900/30 shadow-sm relative overflow-hidden">
								<p className="text-sm text-blue-700 dark:text-blue-300 italic leading-relaxed relative z-10">
									"{report.appealMessage}"
								</p>
								{report.appealedAt && (
									<div className="flex items-center gap-3 mt-4 pt-3 border-t border-blue-200/10">
										<span className="text-[10px] text-blue-500/60 font-medium">
											Submitted: {formatDateShort(report.appealedAt)} at{" "}
											{formatTimeWithSeconds24(report.appealedAt)}
										</span>
									</div>
								)}
							</div>
						</div>
					) : (
						<div className="h-full flex items-center justify-center border border-dashed border-border/40 rounded-lg bg-muted/5 opacity-40">
							<span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
								No Appeal Submitted
							</span>
						</div>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-0 border-t border-border/40">
				<div className="p-8 border-r border-border/10">
					{report.targetType === "ARTICLE" && report.target?.blockingReason && (
						<div className="space-y-3">
							<div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider pl-2 border-l-2 border-rose-500/50">
								Enforcement Reason
							</div>
							<div className="bg-rose-50/20 rounded-lg p-5 border border-rose-200/20 shadow-sm">
								<p className="text-sm text-rose-700 dark:text-rose-300 font-medium">
									{report.target.blockingReason}
								</p>
								<span className="text-[10px] text-rose-500/70 block mt-2 uppercase tracking-wide font-bold">
									Official Administrative Reason
								</span>
							</div>
						</div>
					)}
				</div>

				{/* Admin Action Section */}
				<div className="p-8">
					{report.actionTaken && (
						<div className="space-y-3 relative">
							<div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider pl-2 border-l-2 border-emerald-500/50">
								Admin Resolution
							</div>
							<div className="bg-emerald-50/20 dark:bg-emerald-900/5 rounded-lg p-5 border border-emerald-200/20 dark:border-emerald-900/30 shadow-sm relative">
								<div className="absolute left-[-1.6rem] top-1/2 w-3 h-[2px] bg-emerald-500/30 hidden md:block"></div>
								<div className="flex justify-between items-start gap-4 mb-3">
									<div className="space-y-1">
										<span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 uppercase font-bold tracking-tight">
											Action Taken
										</span>
										<p className="text-sm text-emerald-700 dark:text-emerald-300 font-bold">
											{report.actionTaken}
										</p>
									</div>
									<div className="flex flex-col items-end text-[10px] text-emerald-600/60 font-medium whitespace-nowrap">
										<span>
											{format(
												new Date(report.actionTakenAt || report.updatedAt),
												"MMM dd, yyyy",
											)}
										</span>
										<span>
											{format(
												new Date(report.actionTakenAt || report.updatedAt),
												"HH:mm:ss",
											)}
										</span>
									</div>
								</div>
								<Badge
									variant="outline"
									className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[9px] font-bold px-2 h-5"
								>
									{report.status}
								</Badge>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

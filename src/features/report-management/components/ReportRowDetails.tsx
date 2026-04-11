import { format } from "date-fns";
import {
	AlertCircle,
	Calendar,
	CheckCircle,
	Clock,
	MessageSquareText,
	ShieldAlert,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDateShort, formatTimeWithSeconds24 } from "@/shared/utils/date";
import type { ReportDto } from "../types";

interface ReportRowDetailsProps {
	report: ReportDto;
}

export function ReportRowDetails({ report }: ReportRowDetailsProps) {
	return (
		<div className="flex flex-col gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Reporter Section */}
				<div className="space-y-3">
					<div className="flex items-center gap-2 text-sm font-semibold text-foreground/80 lowercase tracking-tight">
						<AlertCircle className="w-4 h-4 text-amber-500" />
						Reporter's Case
					</div>
					<div className="bg-muted/30 rounded-xl p-4 border border-border/50">
						<div className="flex justify-between items-start mb-2">
							<span className="text-sm font-bold text-foreground">
								{report.reason}
							</span>
							<div className="flex flex-col items-end text-[10px] text-muted-foreground/60 font-medium">
								<span className="flex items-center gap-1">
									<Calendar className="w-3 h-3" />
									{formatDateShort(report.createdAt)}
								</span>
								<span className="flex items-center gap-1">
									<Clock className="w-3 h-3" />
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

				{/* Appeal Section */}
				{report.isAppealSubmitted && (
					<div className="space-y-3">
						<div className="flex items-center gap-2 text-sm font-semibold text-foreground/80 lowercase tracking-tight">
							<MessageSquareText className="w-4 h-4 text-blue-500" />
							Author's Appeal
						</div>
						<div className="bg-blue-50/30 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-200/30 dark:border-blue-900/30">
							<p className="text-sm text-blue-700 dark:text-blue-300 italic leading-relaxed">
								"{report.appealMessage}"
							</p>
							{report.appealedAt && (
								<div className="flex items-center gap-3 mt-3 pt-2 border-t border-blue-200/20">
									<span className="text-[10px] text-blue-500/70 font-medium flex items-center gap-1">
										<Calendar className="w-3 h-3" />
										{formatDateShort(report.appealedAt)}
									</span>
									<span className="text-[10px] text-blue-500/70 font-medium flex items-center gap-1">
										<Clock className="w-3 h-3" />
										{formatTimeWithSeconds24(report.appealedAt)}
									</span>
								</div>
							)}
						</div>
					</div>
				)}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/40">
				{/* Blocking Info */}
				{report.targetType === "ARTICLE" && report.target?.blockingReason && (
					<div className="space-y-3">
						<div className="flex items-center gap-2 text-sm font-semibold text-foreground/80 lowercase tracking-tight">
							<ShieldAlert className="w-4 h-4 text-rose-500" />
							Enforcement Reason
						</div>
						<div className="bg-rose-50/30 dark:bg-rose-900/10 rounded-xl p-4 border border-rose-200/30 dark:border-rose-900/30">
							<p className="text-sm text-rose-700 dark:text-rose-300 font-medium">
								{report.target.blockingReason}
							</p>
							<span className="text-[10px] text-rose-500/70 block mt-1 uppercase tracking-wider font-bold">
								Official Administrative Reason
							</span>
						</div>
					</div>
				)}

				{/* Admin Action Section */}
				{report.actionTaken && (
					<div className="space-y-3">
						<div className="flex items-center gap-2 text-sm font-semibold text-foreground/80 lowercase tracking-tight">
							<CheckCircle className="w-4 h-4 text-emerald-500" />
							Administrative Action
						</div>
						<div className="bg-emerald-50/30 dark:bg-emerald-900/10 rounded-xl p-4 border border-emerald-200/30 dark:border-emerald-900/30">
							<div className="flex justify-between items-start mb-2">
								<p className="text-sm text-emerald-700 dark:text-emerald-300 font-semibold">
									{report.actionTaken}
								</p>
								<div className="flex flex-col items-end text-[10px] text-emerald-600/60 font-medium">
									<span className="flex items-center gap-1">
										<Calendar className="w-3 h-3" />
										{format(
											new Date(report.actionTakenAt || report.updatedAt),
											"MMM dd, yyyy",
										)}
									</span>
									<span className="flex items-center gap-1">
										<Clock className="w-3 h-3" />
										{format(
											new Date(report.actionTakenAt || report.updatedAt),
											"HH:mm:ss",
										)}
									</span>
								</div>
							</div>
							<Badge
								variant="outline"
								className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] py-0 h-4"
							>
								{report.status}
							</Badge>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

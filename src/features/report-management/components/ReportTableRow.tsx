import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import type { ReportDto } from "../types";
import { ReportRowDetails } from "./ReportRowDetails";

interface ReportTableRowProps {
	report: ReportDto;
	isExpanded: boolean;
	onToggle: () => void;
	onAction: (
		report: ReportDto,
		action: "resolve" | "block-user" | "block-article" | "unblock-article",
	) => void;
	isProcessing: boolean;
}

const statusStyles: Record<string, string> = {
	PENDING:
		"bg-amber-500/15 text-amber-700 border-amber-500/30 hover:bg-amber-500/20",
	RESOLVED:
		"bg-emerald-500/15 text-emerald-700 border-emerald-500/30 hover:bg-emerald-500/20",
	REJECTED:
		"bg-rose-500/15 text-rose-600 border-rose-500/30 hover:bg-rose-500/20",
	CLOSED:
		"bg-slate-500/15 text-slate-600 border-slate-500/30 hover:bg-slate-500/20",
};

export function ReportTableRow({
	report,
	isExpanded,
	onToggle,
	onAction,
	isProcessing,
}: ReportTableRowProps) {
	const canUnblock =
		report.targetType === "ARTICLE" &&
		report.isAppealSubmitted &&
		report.appealedAt &&
		new Date(report.appealedAt).getTime() >=
			(report.actionTakenAt ? new Date(report.actionTakenAt).getTime() : 0);

	return (
		<>
			<TableRow
				className={`hover:bg-muted/30 transition-colors cursor-pointer group ${isExpanded ? "bg-muted/20" : ""}`}
				onClick={onToggle}
			>
				<TableCell>
					{isExpanded ? (
						<ChevronUp className="w-4 h-4 text-muted-foreground transition-transform" />
					) : (
						<ChevronDown className="w-4 h-4 text-muted-foreground transition-transform" />
					)}
				</TableCell>
				<TableCell className="py-4">
					<div className="flex flex-col gap-1.5">
						<Badge
							variant="outline"
							className={`w-fit px-2 py-0.5 rounded-md font-bold text-[9px] uppercase tracking-wider ${
								report.targetType === "USER"
									? "border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
									: "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
							}`}
						>
							{report.targetType}
						</Badge>
						<span className="text-sm font-bold text-foreground leading-tight truncate max-w-[320px]">
							{report.target?.title ||
								report.target?.name ||
								`ID: ${report.targetId}`}
						</span>
						<div className="flex gap-3 mt-0.5">
							{report.targetType === "ARTICLE" &&
								report.targetSlug &&
								report.targetSlug !== "undefined" && (
									<Link
										to="/admin-articles/$articleId"
										params={{ articleId: report.targetSlug }}
										className="text-[10px] text-primary hover:underline flex items-center gap-1 font-semibold transition-colors"
										onClick={(e) => e.stopPropagation()}
									>
										<ExternalLink className="w-3 h-3" />
										View Content
									</Link>
								)}
							{report.targetType === "USER" && (
								<Link
									to="/admin-profiles/$profileId"
									params={{ profileId: report.targetId }}
									className="text-[10px] text-primary hover:underline flex items-center gap-1 font-semibold transition-colors"
									onClick={(e) => e.stopPropagation()}
								>
									<ExternalLink className="w-3 h-3" />
									View Profile
								</Link>
							)}
						</div>
					</div>
				</TableCell>
				<TableCell>
					<div className="flex flex-col">
						<span className="text-sm font-semibold text-foreground/90">
							{report.reporter?.name || "Anonymous"}
						</span>
						<span className="text-[10px] text-muted-foreground/70 font-medium truncate max-w-[150px]">
							{report.reporter?.email || report.reporterId}
						</span>
					</div>
				</TableCell>
				<TableCell className="text-center">
					{report.actionTaken?.toLowerCase().includes("unblocked article") ? (
						<Badge
							variant="outline"
							className="text-[9px] font-bold py-0 h-5 px-2 bg-blue-500/10 text-blue-600 border-blue-500/20"
						>
							UNBLOCKED
						</Badge>
					) : (
						<Badge
							variant="outline"
							className={`text-[9px] font-bold py-0 h-5 px-2 ${statusStyles[report.status]}`}
						>
							{report.status}
						</Badge>
					)}
				</TableCell>
				<TableCell className="text-right pr-6">
					<div className="flex items-center justify-end gap-1">
						{report.status === "PENDING" && (
							<Button
								variant="ghost"
								size="sm"
								className="h-8 px-3 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/50 transition-all font-bold text-[11px] rounded-lg"
								onClick={(e) => {
									e.stopPropagation();
									onAction(report, "resolve");
								}}
								disabled={isProcessing}
							>
								Resolve
							</Button>
						)}
						{report.status === "PENDING" && (
							<>
								{report.targetType === "USER" ? (
									<Button
										variant="ghost"
										size="sm"
										className="h-8 px-3 text-rose-600 hover:text-rose-700 hover:bg-rose-50/50 transition-all font-bold text-[11px] rounded-lg"
										onClick={(e) => {
											e.stopPropagation();
											onAction(report, "block-user");
										}}
										disabled={isProcessing}
									>
										Block User
									</Button>
								) : (
									!report.isAppealSubmitted && (
										<Button
											variant="ghost"
											size="sm"
											className="h-8 px-3 text-rose-600 hover:text-rose-700 hover:bg-rose-50/50 transition-all font-bold text-[11px] rounded-lg"
											onClick={(e) => {
												e.stopPropagation();
												onAction(report, "block-article");
											}}
											disabled={isProcessing}
										>
											Block Article
										</Button>
									)
								)}
							</>
						)}
						{canUnblock && (
							<Button
								variant="ghost"
								size="sm"
								className="h-8 px-3 text-primary hover:text-primary hover:bg-primary/10 transition-all font-bold text-[11px] rounded-lg"
								onClick={(e) => {
									e.stopPropagation();
									onAction(report, "unblock-article");
								}}
								disabled={isProcessing}
							>
								Restore Content
							</Button>
						)}
					</div>
				</TableCell>
			</TableRow>
			{isExpanded && (
				<TableRow className="bg-muted/5 border-b border-border/40">
					<TableCell colSpan={5} className="p-0">
						<div className="p-8 bg-gradient-to-b from-muted/20 to-transparent border-t border-border/20">
							<ReportRowDetails report={report} />
						</div>
					</TableCell>
				</TableRow>
			)}
		</>
	);
}

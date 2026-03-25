import { format } from "date-fns";
import {
	Calendar,
	ExternalLink,
	FileX2,
	Loader2,
	ShieldAlert,
	UserX,
} from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useBlockUser } from "@/features/user-management/hooks/use-user-actions";
import { useQueryClient } from "@tanstack/react-query";
import { useBlockArticle, useResolveReport } from "../hooks/use-report-actions";
import type { ReportDto } from "../types";

interface ReportTableProps {
	reports: ReportDto[];
}

type ReportAction = "resolve" | "block-user" | "block-article";

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

export function ReportTable({ reports }: ReportTableProps) {
	const [selectedReport, setSelectedReport] = useState<ReportDto | null>(null);
	const [actionType, setActionType] = useState<ReportAction | null>(null);
	const resolveMutation = useResolveReport();
	const blockArticleMutation = useBlockArticle();
	const blockUserMutation = useBlockUser();
	const queryClient = useQueryClient();

	const isProcessing =
		resolveMutation.isPending ||
		blockArticleMutation.isPending ||
		blockUserMutation.isPending;

	const handleAction = async () => {
		if (!selectedReport || !actionType) return;

		if (actionType === "resolve") {
			await resolveMutation.mutateAsync(
				{
					reportId: selectedReport.id,
					status: "RESOLVED",
					actionTaken: "Marked as resolved",
				},
				{
					onSuccess: () => {
						setSelectedReport(null);
						setActionType(null);
					},
				},
			);
			return;
		}

		if (actionType === "block-article") {
			await blockArticleMutation.mutateAsync(
				{ articleId: selectedReport.targetId },
				{
					onSuccess: () => {
						setSelectedReport(null);
						setActionType(null);
					},
				},
			);
			return;
		}

		await blockUserMutation.mutateAsync(
			{ userId: selectedReport.targetId },
			{
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: ["reports"] });
					setSelectedReport(null);
					setActionType(null);
				},
			},
		);
	};

	const confirmTitle = (() => {
		switch (actionType) {
			case "resolve":
				return "Resolve Report";
			case "block-article":
				return "Block Article";
			case "block-user":
				return "Block User";
			default:
				return "Confirm Action";
		}
	})();

	const confirmMessage = (() => {
		switch (actionType) {
			case "resolve":
				return "Are you sure you want to mark this report as resolved?";
			case "block-article":
				return `Are you sure you want to block article ${selectedReport?.targetId}?`;
			case "block-user":
				return `Are you sure you want to block user ${selectedReport?.targetId}?`;
			default:
				return "Are you sure you want to proceed?";
		}
	})();

	const confirmText = (() => {
		if (isProcessing) {
			return (
				<div className="flex items-center gap-2">
					<Loader2 className="w-4 h-4 animate-spin" />
					<span>Processing...</span>
				</div>
			);
		}

		switch (actionType) {
			case "resolve":
				return "Mark Resolved";
			case "block-article":
				return "Block Article";
			case "block-user":
				return "Block User";
			default:
				return "Confirm";
		}
	})();

	return (
		<div className="bg-card rounded-xl border shadow-sm overflow-hidden">
			<Table>
				<TableHeader className="bg-muted/50">
					<TableRow>
						<TableHead className="w-[220px] py-4">Target</TableHead>
						<TableHead>Reporter</TableHead>
						<TableHead>Reason</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Reported</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{reports.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={6}
								className="h-48 text-center text-muted-foreground"
							>
								<div className="flex flex-col items-center gap-2">
									<ShieldAlert className="w-8 h-8 opacity-20" />
									<p>No reports found matching your criteria.</p>
								</div>
							</TableCell>
						</TableRow>
					) : (
						reports.map((report) => (
							<TableRow
								key={report.id}
								className="hover:bg-muted/30 transition-colors"
							>
								<TableCell className="py-4">
									<div className="flex flex-col gap-1">
										<Badge
											variant="outline"
											className={`w-fit px-2 py-0.5 rounded-md font-medium ${
												report.targetType === "USER"
													? "border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
													: "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
											}`}
										>
											{report.targetType}
										</Badge>
										<span className="text-xs text-muted-foreground">
											ID: {report.targetId}
										</span>
										{report.targetType === "ARTICLE" && report.targetSlug && (
											<Link
												to="/articles/$articleId"
												params={{ articleId: report.targetSlug }}
												className="text-xs text-primary hover:underline flex items-center gap-1 w-fit mt-1 font-medium"
											>
												<ExternalLink className="w-3 h-3" />
												View Article
											</Link>
										)}
									</div>
								</TableCell>
								<TableCell>
									<span className="text-sm text-muted-foreground">
										{report.reporterId}
									</span>
								</TableCell>
								<TableCell>
									<div className="flex flex-col">
										<span className="text-sm font-semibold text-foreground/90">
											{report.reason}
										</span>
										<span className="text-xs text-muted-foreground line-clamp-2">
											{report.description || "No description provided."}
										</span>
									</div>
								</TableCell>
								<TableCell>
									<Badge
										variant="outline"
										className={statusStyles[report.status]}
									>
										{report.status}
									</Badge>
								</TableCell>
								<TableCell>
									<span className="text-sm text-muted-foreground flex items-center gap-1.5 font-medium">
										<Calendar className="w-3.5 h-3.5" />
										{format(new Date(report.createdAt), "MMM dd, yyyy")}
									</span>
								</TableCell>
								<TableCell className="text-right">
									<div className="flex items-center justify-end gap-2">
										<Button
											variant="ghost"
											size="sm"
											className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 transition-all font-semibold"
											onClick={() => {
												setSelectedReport(report);
												setActionType("resolve");
											}}
											disabled={isProcessing || report.status !== "PENDING"}
										>
											<ShieldAlert className="w-4 h-4 mr-2" />
											Resolve
										</Button>
										{report.status === "PENDING" && (
											<>
												{report.targetType === "USER" ? (
													<Button
														variant="ghost"
														size="sm"
														className="text-rose-600 hover:text-rose-700 hover:bg-rose-50/50 dark:hover:bg-rose-900/20 transition-all font-semibold"
														onClick={() => {
															setSelectedReport(report);
															setActionType("block-user");
														}}
														disabled={isProcessing}
													>
														<UserX className="w-4 h-4 mr-2" />
														Block User
													</Button>
												) : (
													<Button
														variant="ghost"
														size="sm"
														className="text-rose-600 hover:text-rose-700 hover:bg-rose-50/50 dark:hover:bg-rose-900/20 transition-all font-semibold"
														onClick={() => {
															setSelectedReport(report);
															setActionType("block-article");
														}}
														disabled={isProcessing}
													>
														<FileX2 className="w-4 h-4 mr-2" />
														Block Article
													</Button>
												)}
											</>
										)}
									</div>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>

			<ConfirmModal
				isOpen={!!selectedReport && !!actionType}
				onClose={() => {
					setSelectedReport(null);
					setActionType(null);
				}}
				onConfirm={handleAction}
				title={confirmTitle}
				message={confirmMessage}
				variant={actionType === "resolve" ? "green" : "destructive"}
				confirmText={confirmText}
				isLoading={isProcessing}
			/>
		</div>
	);
}

import { Loader2, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { ConfirmModal } from "@/components/common/ConfirmModal";
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
import {
	useBlockArticle,
	useResolveReport,
	useUnblockArticle,
} from "../hooks/use-report-actions";
import type { ReportDto } from "../types";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ReportTableRow } from "./ReportTableRow";

interface ReportTableProps {
	reports: ReportDto[];
}

type ReportAction =
	| "resolve"
	| "block-user"
	| "block-article"
	| "unblock-article";

export function ReportTable({ reports }: ReportTableProps) {
	const [selectedReport, setSelectedReport] = useState<ReportDto | null>(null);
	const [actionType, setActionType] = useState<ReportAction | null>(null);
	const [adminReason, setAdminReason] = useState("");
	const [expandedId, setExpandedId] = useState<string | null>(null);

	const resolveMutation = useResolveReport();
	const blockArticleMutation = useBlockArticle();
	const unblockArticleMutation = useUnblockArticle();
	const blockUserMutation = useBlockUser();
	const queryClient = useQueryClient();

	const isProcessing =
		resolveMutation.isPending ||
		blockArticleMutation.isPending ||
		unblockArticleMutation.isPending ||
		blockUserMutation.isPending;

	const handleAction = async () => {
		if (!selectedReport || !actionType) return;

		const targetReportId = selectedReport.id;

		if (actionType === "resolve") {
			await resolveMutation.mutateAsync(
				{
					reportId: targetReportId,
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
				{
					articleId: selectedReport.targetId,
					reason: adminReason || selectedReport.reason,
					reportId: targetReportId,
				},
				{
					onSuccess: () => {
						setSelectedReport(null);
						setActionType(null);
						setAdminReason("");
					},
				},
			);
			return;
		}

		if (actionType === "unblock-article") {
			await unblockArticleMutation.mutateAsync(selectedReport.targetId, {
				onSuccess: () => {
					setSelectedReport(null);
					setActionType(null);
				},
			});
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
			case "unblock-article":
				return "Unblock Article";
			default:
				return "Confirm Action";
		}
	})();

	const confirmMessage = (() => {
		switch (actionType) {
			case "resolve":
				return "Are you sure you want to mark this report as resolved?";
			case "block-article":
				return "Are you sure you want to block this article?";
			case "block-user":
				return "Are you sure you want to block this user?";
			case "unblock-article":
				return "Are you sure you want to unblock this article?";
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
			case "unblock-article":
				return "Unblock Article";
			default:
				return "Confirm";
		}
	})();

	return (
		<div className="bg-card rounded-xl border border-border/60 shadow-md overflow-hidden ring-1 ring-black/5">
			<Table>
				<TableHeader className="bg-muted/40 border-b border-border/50">
					<TableRow className="hover:bg-transparent">
						<TableHead className="w-[48px]"></TableHead>
						<TableHead className="min-w-[240px] py-4 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
							Target Content
						</TableHead>
						<TableHead className="min-w-[160px] text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">
							Reporter
						</TableHead>
						<TableHead className="w-[110px] text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 text-center">
							Status
						</TableHead>
						<TableHead className="text-right text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 pr-6">
							Actions
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{reports.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={6}
								className="h-64 text-center text-muted-foreground"
							>
								<div className="flex flex-col items-center gap-3 opacity-60">
									<ShieldAlert className="w-12 h-12 text-muted-foreground/30" />
									<p className="font-medium">
										No reports matching your criteria.
									</p>
								</div>
							</TableCell>
						</TableRow>
					) : (
						reports.map((report) => (
							<ReportTableRow
								key={report.id}
								report={report}
								isExpanded={expandedId === report.id}
								onToggle={() =>
									setExpandedId(expandedId === report.id ? null : report.id)
								}
								onAction={(rep, action) => {
									setSelectedReport(rep);
									setActionType(action);
								}}
								isProcessing={isProcessing}
							/>
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
			>
				{actionType === "block-article" && (
					<div className="mt-4 space-y-2">
						<Label htmlFor="admin-reason" className="text-sm font-medium">
							Administrator Blocking Reason
						</Label>
						<Textarea
							id="admin-reason"
							placeholder="Enter the official reason for blocking this article..."
							value={adminReason}
							onChange={(e) => setAdminReason(e.target.value)}
							className="min-h-[100px] text-sm bg-muted/30 border-muted-foreground/20 focus:border-red-500/50"
						/>
						<p className="text-[10px] text-muted-foreground italic">
							This reason will be visible to the author. If left blank, the
							reporter's reason will be used.
						</p>
					</div>
				)}
			</ConfirmModal>
		</div>
	);
}

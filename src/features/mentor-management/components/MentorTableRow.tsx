import { format } from "date-fns";
import { Calendar, ChevronDown, ChevronUp, Mail } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import type { Mentor } from "@/shared/types/mentor";
import { MentorRowDetails } from "./MentorRowDetails";

interface MentorTableRowProps {
	mentor: Mentor;
	isExpanded: boolean;
	onToggle: () => void;
	onApprove: (mentor: Mentor) => void;
	onReject: (mentor: Mentor) => void;
	isProcessing: boolean;
}

export function MentorTableRow({
	mentor,
	isExpanded,
	onToggle,
	onApprove,
	onReject,
	isProcessing,
}: MentorTableRowProps) {
	return (
		<>
			<TableRow
				className="hover:bg-muted/30 transition-colors cursor-pointer group"
				onClick={onToggle}
			>
				<TableCell>
					{isExpanded ? (
						<ChevronUp className="w-4 h-4 text-muted-foreground" />
					) : (
						<ChevronDown className="w-4 h-4 text-muted-foreground" />
					)}
				</TableCell>
				<TableCell className="py-4">
					<div className="flex items-center gap-3">
						<Avatar className="h-10 w-10 border border-border/50 shadow-sm ring-2 ring-background">
							<AvatarFallback className="bg-primary/5 text-primary">
								{mentor.name.charAt(0)}
							</AvatarFallback>
						</Avatar>
						<div className="flex flex-col">
							<span className="font-semibold text-foreground/90 leading-tight">
								{mentor.name}
							</span>
							<span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
								<Mail className="w-3 h-3" />
								{mentor.email}
							</span>
						</div>
					</div>
				</TableCell>
				<TableCell>
					<div className="flex flex-col">
						<span className="text-sm font-medium">{mentor.currentRole}</span>
						<span className="text-xs text-muted-foreground">
							{mentor.organization}
						</span>
					</div>
				</TableCell>
				<TableCell>
					<Badge
						className={
							mentor.status === "approved"
								? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
								: mentor.status === "rejected"
									? "bg-rose-500/15 text-rose-600 border-rose-500/30"
									: "bg-amber-500/15 text-amber-600 border-amber-500/30"
						}
						variant="outline"
					>
						{mentor.status.toUpperCase()}
					</Badge>
				</TableCell>
				<TableCell>
					<span className="text-sm text-muted-foreground flex items-center gap-1.5 font-medium">
						<Calendar className="w-3.5 h-3.5" />
						{format(new Date(mentor.appliedAt), "MMM dd, yyyy")}
					</span>
				</TableCell>
				<TableCell className="text-right">
					<div className="flex justify-end gap-2">
						{mentor.status === "pending" && (
							<Button
								variant="ghost"
								size="sm"
								className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
								onClick={(e) => {
									e.stopPropagation();
									onApprove(mentor);
								}}
								disabled={isProcessing}
							>
								Approve
							</Button>
						)}
						{mentor.status === "pending" && (
							<Button
								variant="ghost"
								size="sm"
								className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
								onClick={(e) => {
									e.stopPropagation();
									onReject(mentor);
								}}
								disabled={isProcessing}
							>
								Reject
							</Button>
						)}
					</div>
				</TableCell>
			</TableRow>
			{isExpanded && (
				<TableRow className="bg-muted/20">
					<TableCell colSpan={6} className="p-6">
						<MentorRowDetails mentor={mentor} />
					</TableCell>
				</TableRow>
			)}
		</>
	);
}

import { User as UserIcon } from "lucide-react";
import { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/Table";
import type { Mentor } from "@/shared/types/mentor";
import {
	useApproveMentor,
	useRejectMentor,
} from "../hooks/mutations/useMentorActions";
import { MentorActionModals } from "./MentorActionModals";
import { MentorTableRow } from "./MentorTableRow";

interface MentorTableProps {
	mentors: Mentor[];
}

export function MentorTable({ mentors }: MentorTableProps) {
	const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
	const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
	const [actionType, setActionType] = useState<"approve" | "reject" | null>(
		null,
	);
	const [rejectionReason, setRejectionReason] = useState("");

	const approveMutation = useApproveMentor();
	const rejectMutation = useRejectMentor();

	const toggleRow = (id: string) => {
		const newExpanded = new Set(expandedRows);
		if (newExpanded.has(id)) {
			newExpanded.delete(id);
		} else {
			newExpanded.add(id);
		}
		setExpandedRows(newExpanded);
	};

	const handleAction = async () => {
		if (!selectedMentor || !actionType) return;

		if (actionType === "approve") {
			await approveMutation.mutateAsync(selectedMentor.id, {
				onSuccess: () => {
					setSelectedMentor(null);
					setActionType(null);
				},
			});
		} else {
			if (!rejectionReason.trim() || rejectionReason.length < 10) return;
			await rejectMutation.mutateAsync(
				{ mentorId: selectedMentor.id, reason: rejectionReason },
				{
					onSuccess: () => {
						setSelectedMentor(null);
						setActionType(null);
						setRejectionReason("");
					},
				},
			);
		}
	};

	const isProcessing = approveMutation.isPending || rejectMutation.isPending;

	return (
		<div className="bg-card rounded-xl border shadow-sm overflow-hidden">
			<Table>
				<TableHeader className="bg-muted/50">
					<TableRow>
						<TableHead className="w-[50px]"></TableHead>
						<TableHead className="w-[250px] py-4">Mentor Details</TableHead>
						<TableHead>Current Role</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Applied Date</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{mentors.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={6}
								className="h-48 text-center text-muted-foreground"
							>
								<div className="flex flex-col items-center gap-2">
									<UserIcon className="w-8 h-8 opacity-20" />
									<p>No mentor applications found.</p>
								</div>
							</TableCell>
						</TableRow>
					) : (
						mentors.map((mentor) => (
							<MentorTableRow
								key={mentor.id}
								mentor={mentor}
								isExpanded={expandedRows.has(mentor.id)}
								onToggle={() => toggleRow(mentor.id)}
								onApprove={(m) => {
									setSelectedMentor(m);
									setActionType("approve");
								}}
								onReject={(m) => {
									setSelectedMentor(m);
									setActionType("reject");
								}}
								isProcessing={isProcessing}
							/>
						))
					)}
				</TableBody>
			</Table>

			<MentorActionModals
				selectedMentor={selectedMentor}
				actionType={actionType}
				rejectionReason={rejectionReason}
				isProcessing={isProcessing}
				onClose={() => {
					setSelectedMentor(null);
					setActionType(null);
					setRejectionReason("");
				}}
				onConfirm={handleAction}
				onReasonChange={setRejectionReason}
			/>
		</div>
	);
}

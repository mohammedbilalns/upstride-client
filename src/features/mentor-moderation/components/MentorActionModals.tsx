import { Loader2 } from "lucide-react";
import { useId } from "react";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Textarea } from "@/components/ui/Textarea";
import type { Mentor } from "@/shared/types/mentor";

interface MentorActionModalsProps {
	selectedMentor: Mentor | null;
	actionType: "approve" | "reject" | null;
	rejectionReason: string;
	isProcessing: boolean;
	onClose: () => void;
	onConfirm: () => Promise<void>;
	onReasonChange: (reason: string) => void;
}

export function MentorActionModals({
	selectedMentor,
	actionType,
	rejectionReason,
	isProcessing,
	onClose,
	onConfirm,
	onReasonChange,
}: MentorActionModalsProps) {
	const rejectionReasonId = useId();
	if (!selectedMentor) return null;

	return (
		<>
			<ConfirmModal
				isOpen={actionType === "approve"}
				onClose={onClose}
				onConfirm={onConfirm}
				title="Approve Mentor Application"
				message={`Are you sure you want to approve ${selectedMentor.name} as a mentor? They will be granted mentor privileges immediately.`}
				variant="green"
				confirmText={
					isProcessing ? (
						<div className="flex items-center gap-2">
							<Loader2 className="w-4 h-4 animate-spin" />
							<span>Processing...</span>
						</div>
					) : (
						"Approve Application"
					)
				}
				isLoading={isProcessing}
			/>

			<ConfirmModal
				isOpen={actionType === "reject"}
				onClose={onClose}
				onConfirm={onConfirm}
				title="Reject Mentor Application"
				message={`Please provide a reason for rejecting ${selectedMentor.name}'s application. This will be shared with the applicant.`}
				variant="destructive"
				confirmText={
					isProcessing ? (
						<div className="flex items-center gap-2">
							<Loader2 className="w-4 h-4 animate-spin" />
							<span>Processing...</span>
						</div>
					) : (
						"Reject Application"
					)
				}
				isLoading={isProcessing}
			>
				<div className="w-full mt-4 space-y-2">
					<label
						htmlFor={rejectionReasonId}
						className="text-sm font-semibold text-muted-foreground"
					>
						Rejection Reason
					</label>
					<Textarea
						id={rejectionReasonId}
						placeholder="e.g., Insufficient experience in mentioned skills, missing portfolio details..."
						className="min-h-[100px] bg-background"
						value={rejectionReason}
						onChange={(e) => onReasonChange(e.target.value)}
					/>
					{rejectionReason.length > 0 && rejectionReason.length < 10 && (
						<p className="text-[11px] text-rose-500 font-medium">
							Reason must be at least 10 characters long.
						</p>
					)}
				</div>
			</ConfirmModal>
		</>
	);
}

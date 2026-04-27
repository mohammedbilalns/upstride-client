import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Textarea } from "@/components/ui/Textarea";

interface CancelSessionDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	cancelReason: string;
	setCancelReason: (val: string) => void;
	refundPreview: { amount: number | null; percentage: number; reason: string };
	isCancelling: boolean;
}

export function CancelSessionDialog({
	isOpen,
	onClose,
	onConfirm,
	cancelReason,
	setCancelReason,
	refundPreview,
	isCancelling,
}: CancelSessionDialogProps) {
	return (
		<ConfirmModal
			isOpen={isOpen}
			onClose={onClose}
			onConfirm={() => {
				if (!cancelReason.trim()) return;
				onConfirm();
			}}
			title="Cancel session"
			message="Confirm cancellation for this session."
			confirmText="Confirm Cancel"
			variant="destructive"
			isLoading={isCancelling}
		>
			<div className="mt-4 space-y-3">
				<div className="rounded-xl border border-zinc-200/60 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 p-3 text-xs text-zinc-600 dark:text-zinc-300">
					<p className="font-semibold text-zinc-800 dark:text-zinc-100">
						Refund preview
					</p>
					{refundPreview.amount !== null ? (
						<p className="mt-1">
							Refund amount: {refundPreview.amount} coins (
							{refundPreview.percentage}%).
						</p>
					) : (
						<p className="mt-1">
							Refund amount: {refundPreview.percentage}% (coin value
							unavailable).
						</p>
					)}
					<p className="mt-1 text-zinc-500 dark:text-zinc-400">
						{refundPreview.reason}
					</p>
				</div>
				<label
					htmlFor="cancel-reason"
					className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
				>
					Cancellation reason
				</label>
				<Textarea
					id="cancel-reason"
					value={cancelReason}
					onChange={(e) => setCancelReason(e.target.value)}
					placeholder="Please share why you're cancelling..."
					className="min-h-25 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 resize-none focus:ring-primary/20"
				/>
			</div>
		</ConfirmModal>
	);
}

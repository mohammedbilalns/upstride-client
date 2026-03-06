import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
	variant?: "default" | "destructive" | "green";
	isLoading?: boolean;
}

export function ConfirmModal({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = "Confirm",
	cancelText = "Cancel",
	variant = "default",
	isLoading = false,
}: ConfirmModalProps) {
	const variantClass =
		variant === "green"
			? "bg-emerald-600 hover:bg-emerald-700 text-white"
			: undefined;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{message}</DialogDescription>
				</DialogHeader>
				<DialogFooter className="gap-2 sm:gap-0">
					<Button variant="ghost" onClick={onClose} disabled={isLoading}>
						{cancelText}
					</Button>
					<Button
						variant={variant === "destructive" ? "destructive" : "default"}
						className={variantClass}
						onClick={onConfirm}
						disabled={isLoading}
					>
						{isLoading ? "Processing..." : confirmText}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

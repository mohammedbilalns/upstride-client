import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/Dialog";

interface ConfirmModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	confirmText?: ReactNode;
	cancelText?: string;
	variant?: "default" | "destructive" | "green";
	isLoading?: boolean;
	children?: ReactNode;
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
	children,
}: ConfirmModalProps) {
	const variantClass =
		variant === "green"
			? "bg-emerald-600 hover:bg-emerald-700 text-white"
			: undefined;

	return (
		<Dialog open={isOpen} onOpenChange={onClose} modal={false}>
			<DialogContent className="sm:max-w-106.25">
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{message}</DialogDescription>
					{children}
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
						{isLoading && typeof confirmText === "string"
							? "Processing..."
							: confirmText}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

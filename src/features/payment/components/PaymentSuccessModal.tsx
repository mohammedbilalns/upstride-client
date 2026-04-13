import { Link } from "@tanstack/react-router";
import { CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";

type PaymentSuccessModalProps = {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	description: string;
	primaryActionLabel: string;
	primaryActionTo: string;
	secondaryActionLabel?: string;
	secondaryActionTo?: string;
	bookingId?: string;
};

export function PaymentSuccessModal({
	isOpen,
	onClose,
	title,
	description,
	primaryActionLabel,
	primaryActionTo,
	secondaryActionLabel,
	secondaryActionTo,
	bookingId,
}: PaymentSuccessModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-xl overflow-hidden rounded-[2.5rem] border border-zinc-200/50 bg-white/60 shadow-[0_8px_32px_rgba(16,185,129,0.08)] backdrop-blur-2xl p-8 sm:p-10 text-center dark:border-zinc-800/50 dark:bg-zinc-900/60 dark:shadow-[0_8px_32px_rgba(16,185,129,0.05)] [&>button]:hidden">
				<DialogTitle className="sr-only">Payment Success</DialogTitle>
				<DialogDescription className="sr-only">
					Payment completed successfully
				</DialogDescription>

				<div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white/20 to-teal-50/50 dark:from-emerald-950/20 dark:via-zinc-900/20 dark:to-teal-950/20 rounded-[2.5rem] pointer-events-none" />
				<div className="relative z-10 flex flex-col items-center w-full">
					<div className="flex size-20 items-center justify-center rounded-[2rem] bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-lg shadow-emerald-500/20 mb-6 dark:from-emerald-500 dark:to-teal-600 dark:shadow-emerald-900/30">
						<CircleCheck className="size-10" />
					</div>
					<div className="space-y-3 mb-8 w-full">
						<h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
							{title}
						</h1>
						<p className="text-base text-zinc-500 leading-relaxed max-w-md mx-auto dark:text-zinc-400">
							{description}
						</p>
						{bookingId ? (
							<div className="mt-4 inline-flex items-center justify-center px-4 py-2 rounded-2xl bg-zinc-100/80 border border-zinc-200/50 space-x-2 dark:bg-zinc-800/80 dark:border-zinc-700/50">
								<span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold dark:text-zinc-400">
									Booking ID
								</span>
								<span className="text-sm text-zinc-900 font-mono font-medium dark:text-zinc-100">
									{bookingId}
								</span>
							</div>
						) : null}
					</div>

					<div className="mt-8 flex flex-wrap items-center justify-center gap-4">
						<Button
							asChild
							size="lg"
							className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 px-8 h-12 text-base font-medium dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:text-white"
						>
							<Link to={primaryActionTo} onClick={onClose}>
								{primaryActionLabel}
							</Link>
						</Button>
						{secondaryActionLabel && secondaryActionTo ? (
							<Button
								variant="outline"
								asChild
								size="lg"
								className="rounded-full h-12 px-8 text-base font-medium border-zinc-300 bg-transparent text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
							>
								<Link to={secondaryActionTo} onClick={onClose}>
									{secondaryActionLabel}
								</Link>
							</Button>
						) : null}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

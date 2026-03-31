import { Link } from "@tanstack/react-router";
import { CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

type PaymentSuccessPageProps = {
	title: string;
	description: string;
	primaryActionLabel: string;
	primaryActionTo: string;
	secondaryActionLabel?: string;
	secondaryActionTo?: string;
	bookingId?: string;
};

export function PaymentSuccessPage({
	title,
	description,
	primaryActionLabel,
	primaryActionTo,
	secondaryActionLabel,
	secondaryActionTo,
	bookingId,
}: PaymentSuccessPageProps) {
	return (
		<div className="min-h-[70vh] flex items-center justify-center px-4">
			<div className="w-full max-w-xl rounded-3xl border border-emerald-200/60 bg-white/90 shadow-xl backdrop-blur-sm p-8 dark:border-emerald-900/50 dark:bg-zinc-950/70">
				<div className="flex items-start gap-4">
					<div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300">
						<CircleCheck className="size-6" />
					</div>
					<div className="space-y-2">
						<h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
							{title}
						</h1>
						<p className="text-sm text-zinc-600 leading-relaxed dark:text-zinc-300">
							{description}
						</p>
						{bookingId ? (
							<p className="text-xs text-zinc-500 dark:text-zinc-400">
								Booking ID: <span className="font-medium">{bookingId}</span>
							</p>
						) : null}
					</div>
				</div>

				<div className="mt-6 flex flex-wrap items-center gap-3">
					<Button asChild className="rounded-xl">
						<Link to={primaryActionTo}>{primaryActionLabel}</Link>
					</Button>
					{secondaryActionLabel && secondaryActionTo ? (
						<Button variant="outline" asChild className="rounded-xl">
							<Link to={secondaryActionTo}>{secondaryActionLabel}</Link>
						</Button>
					) : null}
				</div>
			</div>
		</div>
	);
}

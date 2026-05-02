import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import {
	ArrowLeft,
	Calendar,
	Clock,
	Coins,
	CreditCard,
	Download,
	Star,
	Video,
	RefreshCcw,
} from "lucide-react";
import { useEffect, useState } from "react";
import FieldError from "@/components/common/FieldError";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/Dialog";
import { Textarea } from "@/components/ui/Textarea";
import { sessionBookingService } from "@/features/session-booking";
import type { Booking } from "@/features/session-booking/types";
import { feedbackFormSchema } from "@/features/session-booking/validators/feedback.schema";
import { cn } from "@/shared/utils/cn";
import { formatDateShort, formatTimeShort } from "@/shared/utils/date";
import { getErrorMessage } from "@/shared/utils/formValidation";

interface SessionDetailsDialogProps {
	isOpen: boolean;
	onClose: (open: boolean) => void;
	selectedBooking: Booking | null;
	personLabel?: string;
	personName?: string | null;
	payoutLabel?: string;
	reviewTitle?: string;
	showReceipt?: boolean;
	canSubmitReview?: boolean;
	feedbackTitle?: string;
	canSubmitFeedback?: boolean;
	onRepay?: () => void | Promise<void>;
	onSubmitReview?: (input: {
		rating: number;
		comment: string;
	}) => Promise<void>;
	onSubmitFeedback?: (input: { feedback: string }) => Promise<void>;
	onReschedule?: () => void;
	isSubmittingReview?: boolean;
	isSubmittingFeedback?: boolean;
	mode?: "dialog" | "page";
	onBack?: () => void;
	backLabel?: string;
}

export function SessionDetailsDialog({
	isOpen,
	onClose,
	selectedBooking,
	personLabel = "Mentor",
	personName,
	payoutLabel = "Mentor Receives",
	reviewTitle = "Your Review",
	showReceipt = true,
	canSubmitReview = false,
	feedbackTitle = "Mentor Feedback",
	canSubmitFeedback = false,
	onRepay,
	onSubmitReview,
	isSubmittingReview = false,
	onSubmitFeedback,
	onReschedule,
	isSubmittingFeedback = false,
	mode = "dialog",
	onBack,
	backLabel = "Back",
}: SessionDetailsDialogProps) {
	const [reviewRating, setReviewRating] = useState(0);
	const [reviewComment, setReviewComment] = useState("");
	const [isEditingFeedback, setIsEditingFeedback] = useState(false);
	const booking = selectedBooking;
	const existingReview = booking?.review ?? null;
	const existingFeedback = booking?.feedback ?? null;
	const feedbackForm = useForm({
		defaultValues: {
			bookingId: booking?.id ?? "",
			feedback: existingFeedback ?? "",
		},
		onSubmit: async ({ value }) => {
			if (!onSubmitFeedback) return;
			await onSubmitFeedback({ feedback: value.feedback });
			setIsEditingFeedback(false);
		},
		validators: {
			onSubmit: feedbackFormSchema,
		},
	});

	useEffect(() => {
		if (!isOpen) return;
		setReviewRating(existingReview?.rating ?? 0);
		setReviewComment(existingReview?.comment ?? "");
		feedbackForm.reset({
			bookingId: booking?.id ?? "",
			feedback: existingFeedback ?? "",
		});
		setIsEditingFeedback(false);
	}, [
		booking?.id,
		existingFeedback,
		existingReview?.comment,
		existingReview?.rating,
		feedbackForm,
		isOpen,
	]);

	if (!booking) {
		if (mode === "page") return null;

		return (
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent className="sm:max-w-2xl">
					<DialogHeader>
						<DialogTitle>Session Details</DialogTitle>
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<Button type="button" variant="outline">
								Close
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		);
	}

	const isCancelled =
		booking.status === "CANCELLED_BY_MENTEE" ||
		booking.status === "CANCELLED_BY_MENTOR";
	const isCompleted = booking.status === "COMPLETED";
	const isSlotTakenByAnotherUser =
		booking.status === "SLOT_TAKEN_BY_ANOTHER_USER";
	const canManageFeedback = canSubmitFeedback && isCompleted;
	const canJoinMeeting =
		!isCancelled &&
		!isSlotTakenByAnotherUser &&
		!isCompleted &&
		booking.status !== "PENDING" &&
		new Date(booking.endTime).getTime() >= Date.now();
	const canDownloadReceipt =
		booking.status === "CONFIRMED" ||
		booking.status === "STARTED" ||
		isCompleted;
	const canReviewSession =
		canSubmitReview &&
		isCompleted &&
		booking.paymentStatus === "COMPLETED" &&
		Boolean(booking.settledAt) &&
		!existingReview;
	const canReschedule =
		onReschedule &&
		booking.status === "CONFIRMED" &&
		new Date(booking.startTime).getTime() > Date.now() + 24 * 60 * 60 * 1000;
	const showNextStep = !isCompleted;
	const resolvedPayoutLabel = isCompleted
		? payoutLabel.replace("Receives", "Received").replace("Receive", "Received")
		: payoutLabel;
	const review = booking.review;
	const paymentStatusLabel = booking
		? booking.paymentStatus === "COMPLETED"
			? "Payment completed"
			: booking.paymentStatus === "PENDING"
				? "Payment pending"
				: booking.paymentStatus === "FAILED"
					? "Payment failed"
					: "Payment refunded"
		: "";
	const bookingStatusLabel = booking
		? booking.paymentStatus === "FAILED"
			? isSlotTakenByAnotherUser
				? "Slot taken by another user"
				: "Booking failed"
			: booking.status === "STARTED"
				? "Ongoing"
				: booking.status === "COMPLETED"
					? "Completed"
					: booking.status === "CONFIRMED"
						? "Confirmed"
						: booking.status === "PENDING"
							? "Payment Pending"
							: booking.status === "SLOT_TAKEN_BY_ANOTHER_USER"
								? "Slot taken by another user"
								: booking.status === "CANCELLED_BY_MENTEE"
									? "Cancelled by mentee"
									: "Cancelled by mentor"
		: "";

	const handleDownloadReceipt = () => {
		sessionBookingService.downloadReceipt(booking.id);
	};

	const spotlight = (() => {
		if (isSlotTakenByAnotherUser) {
			return {
				title: "Slot taken by another user",
				description:
					"Another user completed payment for this time slot before this booking was confirmed.",
				node: (
					<Badge
						variant="destructive"
						className="w-fit rounded-full px-3 py-1 uppercase bg-amber-500 text-white hover:bg-amber-500"
					>
						Slot taken
					</Badge>
				),
			};
		}

		if (booking.paymentStatus === "FAILED") {
			return {
				title: "Booking failed",
				description:
					"Payment did not complete. Complete payment to confirm the booking.",
				node: (
					<div className="flex flex-wrap items-center gap-2">
						<Badge
							variant="destructive"
							className="w-fit rounded-full px-3 py-1 uppercase"
						>
							Failed
						</Badge>
						{onRepay && (
							<Button type="button" onClick={onRepay}>
								<CreditCard className="h-4 w-4" />
								<span>Complete payment</span>
							</Button>
						)}
					</div>
				),
			};
		}

		if (booking.paymentStatus === "PENDING") {
			return {
				title: "Payment pending",
				description:
					"Complete payment to confirm this booking and unlock the session details.",
				node: onRepay ? (
					<Button type="button" onClick={onRepay}>
						<CreditCard className="h-4 w-4" />
						<span>Complete payment</span>
					</Button>
				) : null,
			};
		}

		if (canReschedule) {
			return {
				title: "Reschedule available",
				description:
					"You can reschedule this session up to 24 hours before the start time.",
				node: (
					<Button type="button" variant="outline" onClick={onReschedule}>
						<RefreshCcw className="mr-2 h-4 w-4" />
						<span>Reschedule Session</span>
					</Button>
				),
			};
		}

		if (canJoinMeeting) {
			return {
				title: "Join meeting room",
				description:
					"Join the room on scheduled time.",
				node: (
					<Link
						to="/call/$bookingId"
						params={{ bookingId: booking.id }}
						className="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
					>
						<Video className="h-4 w-4" />
						<span>Join Meeting Room</span>
					</Link>
				),
			};
		}

		if (canReviewSession) {
			return {
				title: "Review available",
				description: "Submit a short review to share how the session went.",
				node: (
					<Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
						Review ready
					</Badge>
				),
			};
		}

		if (showReceipt && canDownloadReceipt) {
			return {
				title: "Receipt ready",
				description: "Download the receipt or keep it for your records.",
				node: (
					<Button
						type="button"
						variant="outline"
						onClick={handleDownloadReceipt}
					>
						<Download className="h-4 w-4" />
						<span>Download Receipt</span>
					</Button>
				),
			};
		}

		return {
			title: "No immediate action",
			description: "Use the overview below to review the session details.",
			node: null,
		};
	})();

	const handleReviewSubmit = async () => {
		if (!booking || !onSubmitReview || reviewRating < 1) return;
		await onSubmitReview({
			rating: reviewRating,
			comment: reviewComment.trim(),
		});
	};

	type TimelineStep = {
		label: string;
		active: boolean;
		tone?: "warning";
		badgeLabel?: string;
	};

	const timeline: TimelineStep[] = isCancelled
		? [
				{ label: "Booked", active: true },
				{ label: "Cancelled", active: true },
			]
		: isSlotTakenByAnotherUser
			? [
					{
						label:
							booking.paymentStatus === "FAILED"
								? "Payment failed"
								: "Payment pending",
						active: true,
						tone: "warning" as const,
						badgeLabel:
							booking.paymentStatus === "FAILED"
								? "Payment failed"
								: "Payment pending",
					},
					{
						label: "Another user booked slot",
						active: true,
						tone: "warning" as const,
						badgeLabel: "Slot taken",
					},
				]
			: booking.paymentStatus === "PENDING"
				? [
						{
							label: "Payment pending",
							active: true,
							tone: "warning" as const,
							badgeLabel: "Payment pending",
						},
					]
				: booking.paymentStatus === "FAILED"
					? [
							{
								label: "Booking failed",
								active: true,
								tone: "warning" as const,
								badgeLabel: "Payment failed",
							},
						]
					: [
							{ label: "Booked", active: true },
							{
								label: "Confirmed",
								active: booking.status !== "PENDING",
							},
							{
								label: "Live",
								active:
									booking.status === "STARTED" ||
									booking.status === "COMPLETED",
							},
							{
								label: "Completed",
								active: booking.status === "COMPLETED",
							},
						];

	const detailsContent = (
		<>
			<div className="space-y-2">
				<div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
					<div className="space-y-1">
						{mode === "dialog" ? (
							<DialogTitle>Session Details</DialogTitle>
						) : (
							<h1 className="text-2xl font-semibold tracking-tight">
								Session Details
							</h1>
						)}
						<p className="text-sm text-muted-foreground">
							{personLabel}: {personName ?? booking.mentorName ?? personLabel}
						</p>
					</div>
					<div className="flex flex-wrap items-center gap-2">
						<Badge variant="outline" className="uppercase text-[10px]">
							{bookingStatusLabel}
						</Badge>
						<Badge variant="secondary" className="uppercase text-[10px]">
							{paymentStatusLabel}
						</Badge>
					</div>
				</div>
			</div>

			<div className="space-y-3 text-sm">
				<div
					className={cn(
						"grid gap-3",
						mode === "page"
							? "xl:grid-cols-[1.35fr_0.95fr]"
							: "lg:grid-cols-[1.1fr_0.9fr]",
					)}
				>
					<section className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800 p-3.5">
						<p className="text-xs uppercase tracking-wide text-muted-foreground">
							Overview
						</p>
						<div
							className={cn(
								"mt-2.5 grid gap-2.5 sm:grid-cols-2",
								mode === "page" && "2xl:grid-cols-3",
							)}
						>
							<div className="rounded-xl bg-zinc-50/70 dark:bg-zinc-950/30 p-2.5">
								<p className="text-xs uppercase tracking-wide text-muted-foreground">
									Session Date
								</p>
								<p className="mt-1 flex items-center gap-2 font-medium">
									<Calendar className="h-4 w-4 text-primary" />
									{formatDateShort(booking.startTime)}
								</p>
								<p className="text-xs text-muted-foreground">
									<Clock className="mr-1 inline-block h-3.5 w-3.5" />
									{formatTimeShort(booking.startTime)} -{" "}
									{formatTimeShort(booking.endTime)}
								</p>
							</div>
							<div className="rounded-xl bg-zinc-50/70 dark:bg-zinc-950/30 p-2.5">
								<p className="text-xs uppercase tracking-wide text-muted-foreground">
									Booked On
								</p>
								<p className="mt-1 font-medium">
									{formatDateShort(booking.createdAt)}
								</p>
								<p className="text-xs text-muted-foreground">
									{format(
										booking.createdAt
											? new Date(booking.createdAt)
											: new Date(),
										"HH:mm:ss",
									)}
								</p>
							</div>
							<div className="rounded-xl bg-zinc-50/70 dark:bg-zinc-950/30 p-2.5">
								<p className="text-xs uppercase tracking-wide text-muted-foreground">
									Amount
								</p>
								<p className="mt-1 flex items-center gap-2 font-medium">
									{booking.paymentType === "COINS" ? (
										<Coins className="h-4 w-4 text-amber-500" />
									) : (
										<CreditCard className="h-4 w-4 text-blue-500" />
									)}
									{booking.totalAmount} {booking.currency.toUpperCase()}
								</p>
								<p className="text-xs text-muted-foreground">
									{booking.paymentType === "COINS"
										? "Coin payment"
										: "Card payment"}
								</p>
							</div>
							<div className="rounded-xl bg-zinc-50/70 dark:bg-zinc-950/30 p-2.5">
								<p className="text-xs uppercase tracking-wide text-muted-foreground">
									{resolvedPayoutLabel}
								</p>
								<p className="mt-1 flex items-center gap-2 font-medium">
									{booking.mentorPayout.currency === "COINS" ? (
										<Coins className="h-4 w-4 text-amber-500" />
									) : (
										<CreditCard className="h-4 w-4 text-blue-500" />
									)}
									{booking.mentorPayout.amount}{" "}
									{booking.mentorPayout.currency.toUpperCase()}
								</p>
								<p className="text-xs text-muted-foreground">
									{booking.mentorPayout.percentage}% of the amount
								</p>
							</div>
							{!isCompleted && (
								<div className="rounded-xl bg-zinc-50/70 dark:bg-zinc-950/30 p-2.5">
									<p className="text-xs uppercase tracking-wide text-muted-foreground">
										Meeting
									</p>
									<p className="mt-1 font-medium">
										{isCancelled
											? "Not available"
											: booking.status === "PENDING"
												? "Waiting for confirmation"
												: "Ready when session opens"}
									</p>
									<p className="text-xs text-muted-foreground">
										{booking.meetingLink ? "Room assigned" : "No meeting URL"}
									</p>
								</div>
							)}
						</div>
					</section>

					{showNextStep && (
						<section className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800 p-3.5">
							<p className="text-xs uppercase tracking-wide text-muted-foreground">
								Next step
							</p>
							<div className="mt-2.5 rounded-xl border border-primary/15 bg-primary/5 p-3 space-y-2.5">
								<div className="space-y-1">
									<p className="font-semibold text-zinc-900 dark:text-zinc-50">
										{spotlight.title}
									</p>
									<p className="text-sm text-muted-foreground">
										{spotlight.description}
									</p>
								</div>
								{spotlight.node}
							</div>
						</section>
					)}
				</div>

				<section className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800 p-3.5">
					<div className="flex items-center justify-between gap-3">
						<p className="text-xs uppercase tracking-wide text-muted-foreground">
							Status timeline
						</p>
						<Badge variant="outline" className="text-[10px] uppercase">
							{isCancelled ? "Cancelled" : booking.status.replaceAll("_", " ")}
						</Badge>
					</div>
					<div className="mt-3 grid gap-2 sm:grid-cols-4">
						{timeline.map((step, index) => (
							<div key={step.label} className="space-y-2">
								<div
									className={cn(
										"h-1.5 rounded-full",
										step.tone === "warning"
											? "bg-amber-500"
											: step.active
												? "bg-primary"
												: "bg-zinc-200 dark:bg-zinc-800",
										index === timeline.length - 1 ? "" : "",
									)}
								/>
								<div className="flex items-center justify-between gap-2">
									<p
										className={cn(
											"text-xs font-semibold",
											step.tone === "warning"
												? "text-amber-700 dark:text-amber-400"
												: step.active
													? "text-zinc-900 dark:text-zinc-50"
													: "text-zinc-500 dark:text-zinc-400",
										)}
									>
										{step.label}
									</p>
									{step.tone === "warning" ? (
										<Badge
											variant="destructive"
											className="text-[9px] uppercase bg-amber-500 text-white hover:bg-amber-500"
										>
											{step.badgeLabel ?? "Warning"}
										</Badge>
									) : (
										step.active && (
											<Badge
												variant="secondary"
												className="text-[9px] uppercase"
											>
												Active
											</Badge>
										)
									)}
								</div>
							</div>
						))}
					</div>
				</section>

				<div
					className={cn(
						"grid gap-4",
						mode === "page" ? "xl:grid-cols-[1.1fr_0.9fr]" : "lg:grid-cols-2",
					)}
				>
					{review && (
						<section className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800 p-3.5 space-y-2.5">
							<div className="flex items-center justify-between gap-3">
								<p className="text-xs uppercase tracking-wide text-muted-foreground">
									{reviewTitle}
								</p>
								<div className="flex items-center gap-1 text-amber-500">
									{[1, 2, 3, 4, 5].map((star) => (
										<Star
											key={star}
											className={cn(
												"h-4 w-4",
												star <= review.rating && "fill-current",
											)}
										/>
									))}
								</div>
							</div>
							<p className="text-sm font-medium">
								{submittedReviewLabel(review.rating)}
							</p>
							<p className="text-sm text-muted-foreground">{review.comment}</p>
						</section>
					)}

					{existingFeedback &&
						(!canManageFeedback ||
							(canManageFeedback && !isEditingFeedback)) && (
							<section className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800 p-3.5 space-y-2.5">
								<div className="flex items-center justify-between gap-3">
									<p className="text-xs uppercase tracking-wide text-muted-foreground">
										{feedbackTitle}
									</p>
									{canManageFeedback && (
										<Button
											type="button"
											variant="outline"
											size="sm"
											className="h-7 text-xs"
											onClick={() => setIsEditingFeedback(true)}
										>
											Edit Feedback
										</Button>
									)}
								</div>
								<p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
									{existingFeedback}
								</p>
							</section>
						)}

					{canReviewSession && (
						<section className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800 p-3.5 space-y-3">
							<div>
								<p className="text-xs uppercase tracking-wide text-muted-foreground">
									Leave a review
								</p>
								<p className="mt-1 text-sm text-muted-foreground">
									Rate this completed session and share a short note.
								</p>
							</div>
							<div className="flex items-center gap-1 text-amber-500">
								{[1, 2, 3, 4, 5].map((star) => (
									<button
										type="button"
										key={star}
										onClick={() => setReviewRating(star)}
										className="rounded"
									>
										<Star
											className={cn(
												"h-5 w-5 transition-colors",
												star <= reviewRating
													? "fill-current"
													: "text-zinc-300 dark:text-zinc-700",
											)}
										/>
									</button>
								))}
							</div>
							<Textarea
								value={reviewComment}
								onChange={(e) => setReviewComment(e.target.value)}
								placeholder="Write your feedback..."
								className="min-h-[100px]"
							/>
							<div className="flex justify-end">
								<Button
									type="button"
									onClick={handleReviewSubmit}
									disabled={
										isSubmittingReview ||
										reviewRating < 1 ||
										!reviewComment.trim()
									}
								>
									{isSubmittingReview ? "Submitting..." : "Submit Review"}
								</Button>
							</div>
						</section>
					)}

					{canManageFeedback && (!existingFeedback || isEditingFeedback) && (
						<form
							onSubmit={(e) => {
								e.preventDefault();
								e.stopPropagation();
								void feedbackForm.handleSubmit();
							}}
							className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800 p-3.5 space-y-3"
						>
							<div>
								<p className="text-xs uppercase tracking-wide text-muted-foreground">
									{existingFeedback ? "Update feedback" : "Add feedback"}
								</p>
								<p className="mt-1 text-sm text-muted-foreground">
									{existingFeedback
										? "Edit the summary you shared with the mentee."
										: "Share a short summary with the mentee after the session."}
								</p>
							</div>
							<feedbackForm.Field name="feedback">
								{(field) => (
									<div className="space-y-2">
										<Textarea
											id={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Write at least 10 characters..."
											className="min-h-[100px]"
											maxLength={1000}
										/>
										<p className="text-xs text-muted-foreground">
											Minimum 10 characters.
										</p>
										<FieldError
											message={getErrorMessage(field.state.meta.errors?.[0])}
										/>
									</div>
								)}
							</feedbackForm.Field>
							<div className="flex justify-end gap-2">
								{existingFeedback && (
									<Button
										type="button"
										variant="ghost"
										onClick={() => {
											setIsEditingFeedback(false);
											feedbackForm.reset({
												bookingId: booking?.id ?? "",
												feedback: existingFeedback ?? "",
											});
										}}
										disabled={isSubmittingFeedback}
									>
										Cancel
									</Button>
								)}
								<feedbackForm.Subscribe
									selector={(state) => ({
										canSubmit: state.canSubmit,
										isSubmitting: state.isSubmitting,
									})}
								>
									{({ canSubmit, isSubmitting }) => (
										<Button
											type="submit"
											disabled={
												!canSubmit || isSubmitting || isSubmittingFeedback
											}
										>
											{isSubmitting || isSubmittingFeedback
												? "Saving..."
												: existingFeedback
													? "Update Feedback"
													: "Save Feedback"}
										</Button>
									)}
								</feedbackForm.Subscribe>
							</div>
						</form>
					)}

					{showReceipt && canDownloadReceipt && (
						<section className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800 p-3.5 space-y-2.5">
							<div className="flex items-center justify-between gap-3">
								<div>
									<p className="text-xs uppercase tracking-wide text-muted-foreground">
										Receipt
									</p>
									<p className="mt-1 text-sm text-muted-foreground">
										Download a record of this booking.
									</p>
								</div>
							</div>
							<Button
								type="button"
								variant="outline"
								onClick={handleDownloadReceipt}
							>
								<Download className="h-4 w-4" />
								<span>Download Receipt</span>
							</Button>
						</section>
					)}

					{booking.notes && (
						<section className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 p-4">
							<p className="text-xs uppercase tracking-wide text-muted-foreground">
								Notes
							</p>
							<p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
								{booking.notes}
							</p>
						</section>
					)}
				</div>
			</div>
		</>
	);

	if (mode === "page") {
		return (
			<div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.08),transparent_28%),linear-gradient(180deg,hsl(var(--background))_0%,hsl(var(--background))_100%)]">
				<div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-6 md:py-8">
					{onBack ? (
						<Button
							type="button"
							variant="ghost"
							onClick={onBack}
							className="px-0 text-muted-foreground hover:text-foreground"
						>
							<ArrowLeft className="h-4 w-4" />
							<span>{backLabel}</span>
						</Button>
					) : null}
					<div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)]">
						<section className="rounded-[28px] border border-border/60 bg-card/95 p-5 shadow-sm md:p-7">
							{detailsContent}
						</section>
						<aside className="space-y-4">
							<div className="rounded-[24px] border border-border/60 bg-card/95 p-5 shadow-sm">
								<p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
									Session Snapshot
								</p>
								<div className="mt-4 space-y-3">
									<div className="rounded-2xl border border-zinc-200/60 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/30">
										<p className="text-xs uppercase tracking-wide text-muted-foreground">
											{personLabel}
										</p>
										<p className="mt-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
											{personName ?? booking.mentorName ?? personLabel}
										</p>
									</div>
									<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
										<div className="rounded-2xl border border-zinc-200/60 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/30">
											<p className="text-xs uppercase tracking-wide text-muted-foreground">
												Status
											</p>
											<p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
												{bookingStatusLabel}
											</p>
										</div>
										<div className="rounded-2xl border border-zinc-200/60 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-950/30">
											<p className="text-xs uppercase tracking-wide text-muted-foreground">
												Payment
											</p>
											<p className="mt-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
												{paymentStatusLabel}
											</p>
										</div>
									</div>
								</div>
							</div>
						</aside>
					</div>
				</div>
			</div>
		);
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>{detailsContent}</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button type="button" variant="outline">
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

const submittedReviewLabel = (rating: number) => {
	if (rating >= 5) return "Excellent";
	if (rating >= 4) return "Good";
	if (rating >= 3) return "Average";
	if (rating >= 2) return "Below average";
	return "Poor";
};

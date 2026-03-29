import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Flag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ReportDialog } from "@/components/common/ReportDialog";
import { useProfile } from "@/features/profile-management/hooks/use-profile";
import { MentorArticlesSection } from "../components/MentorArticlesSection";
import { toast } from "sonner";
import type { ApiError } from "@/api/apiError";
import { AddBalanceForm } from "@/components/common/AddBalanceForm";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
	coinManagementService,
	useCoinBalance,
} from "@/features/coin-management";
import { publicMentorProfileService } from "@/features/mentor-public-profile";
import type { PublicMentorSlot } from "@/features/mentor-public-profile/types";
import { sessionBookingService } from "@/features/session-booking-management";

interface PublicMentorProfilePageProps {
	mentorId: string;
}

const PENDING_BOOKING_STORAGE_KEY = "pending-booking-slot";

export function PublicMentorProfilePage({
	mentorId,
}: PublicMentorProfilePageProps) {
	const { data: currentUser } = useProfile();
	const queryClient = useQueryClient();
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		new Date(),
	);
	const [bookingSlotId, setBookingSlotId] = useState<string | null>(null);
	const [selectedSlot, setSelectedSlot] = useState<PublicMentorSlot | null>(
		null,
	);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [isTopUpOpen, setIsTopUpOpen] = useState(false);

	const profileQuery = useQuery({
		queryKey: ["public-mentor-profile", mentorId],
		queryFn: () => publicMentorProfileService.getPublicProfile(mentorId),
	});

	const coinBalanceQuery = useCoinBalance();

	const selectedDateKey = useMemo(() => {
		if (!selectedDate) return "";
		const yyyy = selectedDate.getFullYear();
		const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
		const dd = String(selectedDate.getDate()).padStart(2, "0");
		return `${yyyy}-${mm}-${dd}`;
	}, [selectedDate]);

	const slotsQuery = useQuery({
		queryKey: ["public-mentor-available-slots", mentorId, selectedDateKey],
		queryFn: () =>
			publicMentorProfileService.getAvailableSlotsForDay(
				mentorId,
				selectedDateKey,
			),
		enabled: Boolean(selectedDateKey),
	});

	const bookMutation = useMutation({
		mutationFn: (slotId: string) =>
			sessionBookingService.bookSession({ slotId }),
		onMutate: (slotId) => {
			setBookingSlotId(slotId);
		},
		onSuccess: (response) => {
			toast.success(response.message || "Session booked successfully");
			setIsConfirmOpen(false);
			setSelectedSlot(null);
			queryClient.invalidateQueries({ queryKey: ["wallet", "balance"] });
			queryClient.invalidateQueries({
				queryKey: ["public-mentor-profile", mentorId],
			});
			queryClient.invalidateQueries({
				queryKey: ["public-mentor-available-slots", mentorId],
			});
		},
		onError: (error) => {
			const message =
				(error as ApiError | undefined)?.response?.data?.message ||
				"Failed to book session";
			toast.error(message);
			setIsConfirmOpen(false);
		},
		onSettled: () => {
			setBookingSlotId(null);
		},
	});

	const profile = profileQuery.data?.data.profile;
	const nextAvailableSessions =
		profileQuery.data?.data.nextAvailableSessions ?? [];
	const isReported = profileQuery.data?.data.isReported ?? false;
	const availableSlots = slotsQuery.data?.data.slots ?? [];
	const coinBalance = coinBalanceQuery.data?.coinBalance ?? 0;
	const coinValue = coinBalanceQuery.data?.coinValue;

	const formatDate = (value: Date) =>
		value.toLocaleDateString(undefined, {
			year: "numeric",
			month: "long",
			day: "numeric",
		});

	const formatTime = (value: string) => {
		const date = new Date(value);
		if (Number.isNaN(date.getTime())) return value;
		return date.toLocaleTimeString(undefined, {
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const storePendingSlot = (slot: PublicMentorSlot) => {
		try {
			localStorage.setItem(
				PENDING_BOOKING_STORAGE_KEY,
				JSON.stringify({ mentorId, slot, source: "mentor" }),
			);
		} catch {
			// Ignore storage failures.
		}
	};

	const loadPendingSlot = () => {
		try {
			const raw = localStorage.getItem(PENDING_BOOKING_STORAGE_KEY);
			if (!raw) return null;
			const parsed = JSON.parse(raw) as {
				mentorId: string;
				slot: PublicMentorSlot;
				source?: string;
			};
			if (parsed.mentorId !== mentorId) return null;
			if (parsed.source !== "mentor") return null;
			return parsed.slot;
		} catch {
			return null;
		}
	};

	const clearPendingSlot = () => {
		try {
			localStorage.removeItem(PENDING_BOOKING_STORAGE_KEY);
		} catch {
			// Ignore storage failures.
		}
	};

	useEffect(() => {
		if (!coinBalanceQuery.data) return;
		const pending = loadPendingSlot();
		if (!pending) return;
		if (coinBalance >= pending.price) {
			setSelectedSlot(pending);
			setIsConfirmOpen(true);
			clearPendingSlot();
		}
	}, [coinBalance, coinBalanceQuery.data, mentorId]);

	const handleBookClick = (slot: PublicMentorSlot) => {
		setSelectedSlot(slot);
		if (coinBalanceQuery.isLoading) {
			toast.info("Checking your coin balance...");
			return;
		}
		if (coinBalance < slot.price) {
			setIsTopUpOpen(true);
			return;
		}
		setIsConfirmOpen(true);
	};

	const handleConfirmBooking = () => {
		if (!selectedSlot) return;
		bookMutation.mutate(selectedSlot.id);
	};

	const handleCheckout = async (coins: number) => {
		if (!selectedSlot) return;
		storePendingSlot(selectedSlot);
		const session = await coinManagementService.createCheckoutSession({
			coins,
		});
		if (session.url) {
			window.location.href = session.url;
		}
	};

	if (profileQuery.isLoading) {
		return (
			<div className="px-6 py-10">
				<p className="text-sm text-muted-foreground">Loading profile...</p>
			</div>
		);
	}

	if (!profile) {
		return (
			<div className="px-6 py-10">
				<p className="text-sm text-muted-foreground">
					Mentor profile not found.
				</p>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-6 py-8 space-y-8">
			<div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
				<Card className="border-border/60 shadow-sm">
					<CardHeader className="space-y-4">
						<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
							<div className="flex items-center gap-4">
								<Avatar className="h-16 w-16 rounded-2xl border">
									<AvatarImage
										src={profile.user.avatar || ""}
										alt={profile.user.name}
										className="object-cover"
									/>
									<AvatarFallback className="rounded-2xl bg-amber-100 text-amber-700">
										{profile.user.name.charAt(0).toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div>
									<h1 className="text-2xl font-semibold">
										{profile.user.name}
									</h1>
									<p className="text-sm text-muted-foreground">
										{profile.currentRole?.name || "Mentor"}
									</p>
									<p className="text-sm text-muted-foreground">
										{profile.organization}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<Button asChild className="px-6">
									<Link
										to="/chats/$chatId"
										params={{ chatId: profile.user.id }}
										state={{
											receiver: {
												id: profile.user.id,
												name: profile.user.name,
												profilePictureUrl: profile.user.avatar ?? null,
											},
										}}
									>
										Chat
									</Link>
								</Button>
								{profile.personalWebsite && (
									<Button variant="outline" className="px-6" asChild>
										<a
											href={profile.personalWebsite}
											target="_blank"
											rel="noreferrer"
										>
											Website
										</a>
									</Button>
								)}
								{currentUser?.id !== profile.user.id &&
									(isReported ? (
										<Button
											variant="outline"
											className="px-4 text-muted-foreground cursor-not-allowed"
											disabled
										>
											<Flag className="h-4 w-4 mr-1" />
											Report Submitted
										</Button>
									) : (
										<ReportDialog
											targetId={profile.user.id}
											targetType="USER"
											trigger={
												<Button variant="outline" className="px-4">
													<Flag className="h-4 w-4" />
												</Button>
											}
										/>
									))}
							</div>
						</div>
						<div className="flex flex-wrap gap-2">
							<Badge variant="secondary">
								{profile.yearsOfExperience} years experience
							</Badge>
							<Badge variant="secondary">
								{profile.avgRating.toFixed(1)} rating
							</Badge>
						</div>
					</CardHeader>
					<CardContent className="space-y-6">
						<p className="text-sm text-muted-foreground leading-relaxed">
							{profile.bio}
						</p>
						<Separator />
						<div className="space-y-3">
							<h3 className="text-sm font-semibold">Expertise</h3>
							<div className="flex flex-wrap gap-2">
								{profile.expertises.map((expertise) => (
									<Badge key={expertise.id} variant="secondary">
										{expertise.name}
									</Badge>
								))}
							</div>
						</div>
						<div className="space-y-3">
							<h3 className="text-sm font-semibold">Skills</h3>
							<div className="flex flex-wrap gap-2">
								{profile.skills.map((skill) => (
									<Badge key={skill.id} variant="outline">
										{skill.name} · {skill.level.toLowerCase()}
									</Badge>
								))}
							</div>
						</div>
						<div className="space-y-3">
							<h3 className="text-sm font-semibold">Education</h3>
							<ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
								{profile.educationalQualifications.map((edu) => (
									<li key={edu}>{edu}</li>
								))}
							</ul>
						</div>
					</CardContent>
				</Card>

				<Card className="border-border/60 shadow-sm">
					<CardHeader>
						<CardTitle className="text-lg">Next available sessions</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						{nextAvailableSessions.length === 0 && (
							<p className="text-sm text-muted-foreground">
								No upcoming sessions yet.
							</p>
						)}
						{nextAvailableSessions.map((slot) => (
							<div
								key={slot.id}
								className="flex items-center justify-between rounded-lg border border-border/60 p-3"
							>
								<div>
									<p className="font-medium">
										{formatTime(slot.startTime)} - {formatTime(slot.endTime)}
									</p>
									<p className="text-xs text-muted-foreground">
										{new Date(slot.startTime).toLocaleDateString()} ·{" "}
										{slot.durationMinutes} mins · {slot.price} coins
									</p>
								</div>
								<div className="flex items-center gap-2">
									<Badge variant="secondary">Available</Badge>
									<Button
										size="sm"
										onClick={() => handleBookClick(slot)}
										disabled={
											bookMutation.isPending && bookingSlotId === slot.id
										}
									>
										{bookMutation.isPending && bookingSlotId === slot.id
											? "Booking..."
											: "Book"}
									</Button>
								</div>
							</div>
						))}
					</CardContent>
				</Card>
			</div>

			<Card className="border-border/60 shadow-sm">
				<CardHeader className="flex flex-col gap-2">
					<CardTitle className="text-lg">Pick a day</CardTitle>
					<p className="text-sm text-muted-foreground">
						Choose a date to see available slots.
					</p>
				</CardHeader>
				<CardContent className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
					<div className="border border-border/60 rounded-lg p-3">
						<Calendar
							mode="single"
							selected={selectedDate}
							onSelect={(date) => setSelectedDate(date ?? undefined)}
							className="w-full"
						/>
					</div>
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<h3 className="font-semibold">Available slots</h3>
							{selectedDate && (
								<span className="text-sm text-muted-foreground">
									{formatDate(selectedDate)}
								</span>
							)}
						</div>
						{slotsQuery.isLoading && (
							<p className="text-sm text-muted-foreground">Loading slots...</p>
						)}
						{!slotsQuery.isLoading && availableSlots.length === 0 && (
							<p className="text-sm text-muted-foreground">
								No available slots for this day.
							</p>
						)}
						{availableSlots.map((slot) => (
							<div
								key={slot.id}
								className="flex items-center justify-between rounded-lg border border-border/60 p-3"
							>
								<div>
									<p className="font-medium">
										{formatTime(slot.startTime)} - {formatTime(slot.endTime)}
									</p>
									<p className="text-xs text-muted-foreground">
										{slot.durationMinutes} mins · {slot.price} coins
									</p>
								</div>
								<div className="flex items-center gap-2">
									<Badge variant="secondary">Available</Badge>
									<Button
										size="sm"
										onClick={() => handleBookClick(slot)}
										disabled={
											bookMutation.isPending && bookingSlotId === slot.id
										}
									>
										{bookMutation.isPending && bookingSlotId === slot.id
											? "Booking..."
											: "Book"}
									</Button>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			<Card className="border-border/60 shadow-sm mt-8">
				<CardHeader>
					<CardTitle className="text-lg">Articles</CardTitle>
					<p className="text-sm text-muted-foreground">
						Insights and articles published by {profile.user.name}.
					</p>
				</CardHeader>
				<CardContent>
					<MentorArticlesSection authorId={profile.user.id} />
				</CardContent>
			</Card>
			<ConfirmModal
				isOpen={isConfirmOpen}
				onClose={() => {
					setIsConfirmOpen(false);
					setSelectedSlot(null);
				}}
				onConfirm={handleConfirmBooking}
				title="Confirm booking"
				message={
					selectedSlot
						? `Book this session for ${selectedSlot.price} coins?`
						: "Book this session?"
				}
				confirmText="Confirm booking"
				isLoading={bookMutation.isPending}
			>
				{selectedSlot && (
					<div className="mt-3 space-y-1 text-sm text-muted-foreground">
						<p>
							Time: {formatTime(selectedSlot.startTime)} -{" "}
							{formatTime(selectedSlot.endTime)}
						</p>
						<p>Duration: {selectedSlot.durationMinutes} mins</p>
						<p>
							Balance after booking:{" "}
							{Math.max(coinBalance - selectedSlot.price, 0)}
						</p>
					</div>
				)}
			</ConfirmModal>
			<Dialog open={isTopUpOpen} onOpenChange={setIsTopUpOpen}>
				<DialogContent className="sm:max-w-[520px]">
					<DialogHeader>
						<DialogTitle>Insufficient coins</DialogTitle>
						<DialogDescription>
							You need{" "}
							{selectedSlot ? Math.max(selectedSlot.price - coinBalance, 0) : 0}{" "}
							more coins to book this session.
						</DialogDescription>
					</DialogHeader>
					<div className="mt-2 space-y-4">
						<div className="rounded-lg border border-border/60 p-3 text-sm text-muted-foreground">
							<p>
								Current balance:{" "}
								<span className="font-semibold text-foreground">
									{coinBalance} coins
								</span>
							</p>
						</div>
						<AddBalanceForm
							onSubmit={handleCheckout}
							coinValue={coinValue}
							label="Purchase coins"
							placeholder="Enter Coins"
						/>
						<div className="text-xs text-muted-foreground">
							After payment, you will be redirected back to continue booking.
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Flag, CreditCard, Coins } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import type { AvailabilitySlot } from "@/features/availability-management/types";
import { sessionBookingService } from "@/features/session-booking-management";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

declare module "@tanstack/react-router" {
	interface HistoryState {
		receiver?: {
			id: string;
			name: string;
			profilePictureUrl?: string | null;
		};
	}
}

interface PublicMentorProfilePageProps {
	mentorId: string;
	isAdminView?: boolean;
}

export function PublicMentorProfilePage({
	mentorId,
	isAdminView = false,
}: PublicMentorProfilePageProps) {
	const navigate = useNavigate();
	const { data: currentUser } = useProfile();
	const queryClient = useQueryClient();
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		new Date(),
	);
	const [bookingSlotId, setBookingSlotId] = useState<string | null>(null);
	const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(
		null,
	);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [isTopUpOpen, setIsTopUpOpen] = useState(false);
	const [paymentType, setPaymentType] = useState<"COINS" | "STRIPE">("COINS");
	const today = useMemo(() => {
		const d = new Date();
		d.setHours(0, 0, 0, 0);
		return d;
	}, []);

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
		enabled: Boolean(selectedDateKey) && !isAdminView,
	});

	const clearTopupState = useCallback(() => {
		localStorage.removeItem("pending_booking_topup");
		const params = new URLSearchParams(window.location.search);
		if (!params.has("topup")) return;
		params.delete("topup");
		const next = params.toString();
		const url = `${window.location.pathname}${next ? `?${next}` : ""}`;
		window.history.replaceState({}, "", url);
	}, []);

	const bookMutation = useMutation({
		mutationFn: (data: {
			mentorId: string;
			startTime: string;
			endTime: string;
			paymentType: "COINS" | "STRIPE";
		}) => sessionBookingService.bookSession(data),
		onMutate: (data) => {
			setBookingSlotId(data.startTime);
		},
		onSuccess: (response) => {
			if (response.data.paymentUrl) {
				window.location.href = response.data.paymentUrl;
				return;
			}
			clearTopupState();
			navigate({
				to: "/bookings/success",
				search: { id: response.data.bookingId },
			});
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
			clearTopupState();
		},
		onSettled: () => {
			setBookingSlotId(null);
		},
	});

	const profile = profileQuery.data?.data.profile;
	const isReported = profileQuery.data?.data.isReported ?? false;
	const availableSlots = slotsQuery.data?.data.slots ?? [];
	const coinBalance = coinBalanceQuery.data?.coinBalance ?? 0;
	const coinValue = coinBalanceQuery.data?.coinValue;
	const directPaymentAmount =
		selectedSlot && coinValue ? selectedSlot.price / coinValue : undefined;
	const requiredCoins = selectedSlot
		? Math.max(selectedSlot.price - coinBalance, 0)
		: 0;
	const insufficientCoins =
		paymentType === "COINS" &&
		!!selectedSlot &&
		coinBalance < selectedSlot.price;

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

	const handleBookClick = (slot: AvailabilitySlot) => {
		setSelectedSlot(slot);
		setIsConfirmOpen(true);
	};

	const handleConfirmBooking = useCallback(() => {
		if (!selectedSlot) return;

		if (paymentType === "COINS" && coinBalance < selectedSlot.price) {
			setIsTopUpOpen(true);
			setIsConfirmOpen(false);
			return;
		}

		bookMutation.mutate({
			mentorId,
			startTime: selectedSlot.startTime,
			endTime: selectedSlot.endTime,
			paymentType,
		});
	}, [selectedSlot, paymentType, coinBalance, mentorId, bookMutation]);

	const handleCheckout = async (coins: number) => {
		if (selectedSlot) {
			localStorage.setItem(
				"pending_booking_topup",
				JSON.stringify({
					mentorId,
					slot: selectedSlot,
				}),
			);
		}
		const params = new URLSearchParams(window.location.search);
		params.set("topup", "1");
		const successPath = `${window.location.pathname}?${params.toString()}`;
		const session = await coinManagementService.createCheckoutSession({
			coins,
			successPath,
			cancelPath: successPath,
		});
		if (session.url) {
			window.location.href = session.url;
		}
	};

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		if (params.get("topup") !== "1") return;
		if (selectedSlot) return;
		const raw = localStorage.getItem("pending_booking_topup");
		if (!raw) return;
		try {
			const parsed = JSON.parse(raw) as {
				mentorId: string;
				slot: AvailabilitySlot;
			};
			if (parsed?.mentorId !== mentorId || !parsed?.slot) return;
			setSelectedSlot(parsed.slot);
			setPaymentType("COINS");
			setIsTopUpOpen(false);
			setIsConfirmOpen(true);
		} catch {
			// ignore
		}
	}, [mentorId, selectedSlot]);

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
			{isAdminView && (
				<Button
					variant="ghost"
					asChild
					className="-ml-4 h-8 text-muted-foreground mr-auto mb-2"
				>
					<Link to="/report-management" search={{ page: 1, limit: 10 }}>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Reports
					</Link>
				</Button>
			)}
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
							{!isAdminView && (
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
							)}
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
			</div>

			{!isAdminView && (
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
								fromDate={today}
								disabled={(date) => date < today}
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
								<p className="text-sm text-muted-foreground">
									Loading slots...
								</p>
							)}
							{!slotsQuery.isLoading && availableSlots.length === 0 && (
								<p className="text-sm text-muted-foreground">
									No available slots for this day.
								</p>
							)}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								{availableSlots.map((slot) => (
									<div
										key={slot.startTime}
										className="flex items-center justify-between rounded-lg border border-border/60 p-3"
									>
										<div>
											<p className="font-medium">
												{formatTime(slot.startTime)} -{" "}
												{formatTime(slot.endTime)}
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
													bookMutation.isPending &&
													bookingSlotId === slot.startTime
												}
											>
												{bookMutation.isPending &&
												bookingSlotId === slot.startTime
													? "Booking..."
													: "Book"}
											</Button>
										</div>
									</div>
								))}
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			<Card className="border-border/60 shadow-sm mt-8">
				<CardHeader>
					<CardTitle className="text-lg">Articles</CardTitle>
					<p className="text-sm text-muted-foreground">
						Insights and articles published by {profile.user.name}.
					</p>
				</CardHeader>
				<CardContent>
					<MentorArticlesSection
						authorId={profile.user.id}
						isAdminView={isAdminView}
					/>
				</CardContent>
			</Card>
			<ConfirmModal
				isOpen={isConfirmOpen}
				onClose={() => {
					clearTopupState();
					setIsConfirmOpen(false);
					setSelectedSlot(null);
				}}
				onConfirm={handleConfirmBooking}
				title={insufficientCoins ? "Insufficient coins" : "Confirm booking"}
				message={
					insufficientCoins
						? "You don't have enough coins to pay."
						: selectedSlot
							? "Book this session?"
							: "Book this session?"
				}
				confirmText={
					insufficientCoins
						? "Add more coins"
						: paymentType === "STRIPE"
							? "Pay and book"
							: "Confirm booking"
				}
				isLoading={bookMutation.isPending}
			>
				{selectedSlot && (
					<div className="mt-4 space-y-4">
						<div className="space-y-1 text-sm text-muted-foreground">
							{insufficientCoins && (
								<p className="rounded-md border border-amber-200/80 bg-amber-50/70 px-3 py-2 text-xs text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">
									You don&apos;t have enough coins to pay. Add more coins to
									continue.
								</p>
							)}
							<p>
								Time: {formatTime(selectedSlot.startTime)} -{" "}
								{formatTime(selectedSlot.endTime)}
							</p>
							<p>Duration: {selectedSlot.durationMinutes} mins</p>
							<p className="font-medium text-foreground">
								Price:{" "}
								{paymentType === "STRIPE" && directPaymentAmount !== undefined
									? `₹${directPaymentAmount.toFixed(2)}`
									: `${selectedSlot.price} coins`}
							</p>
						</div>

						<Separator />

						<div className="space-y-3">
							<Label className="text-sm font-semibold">Payment Method</Label>
							<RadioGroup
								value={paymentType}
								onValueChange={(val: "COINS" | "STRIPE") => setPaymentType(val)}
								className="grid grid-cols-2 gap-4"
							>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="COINS" id="coins" />
									<Label
										htmlFor="coins"
										className="flex items-center gap-2 cursor-pointer"
									>
										<Coins className="h-4 w-4 text-amber-500" />
										Coins ({coinBalance})
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="STRIPE" id="stripe" />
									<Label
										htmlFor="stripe"
										className="flex items-center gap-2 cursor-pointer"
									>
										<CreditCard className="h-4 w-4 text-blue-500" />
										Direct Payment
										{directPaymentAmount !== undefined
											? ` (₹${directPaymentAmount.toFixed(2)})`
											: ""}
									</Label>
								</div>
							</RadioGroup>
						</div>

						{paymentType === "COINS" && (
							<p className="text-xs text-muted-foreground">
								Balance after booking:{" "}
								<span
									className={
										coinBalance < selectedSlot.price ? "text-red-500" : ""
									}
								>
									{Math.max(coinBalance - selectedSlot.price, 0)} coins
								</span>
							</p>
						)}
					</div>
				)}
			</ConfirmModal>
			<Dialog open={isTopUpOpen} onOpenChange={setIsTopUpOpen}>
				<DialogContent className="sm:max-w-[520px]">
					<DialogHeader>
						<DialogTitle>Add more coins</DialogTitle>
						<DialogDescription>
							Add coins to continue booking this session.
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
						<Separator />
						<AddBalanceForm
							key={requiredCoins || 0}
							onSubmit={handleCheckout}
							coinValue={coinValue}
							label="Purchase coins"
							placeholder="Enter Coins"
							defaultCoins={requiredCoins}
							minCoins={requiredCoins}
							minCoinsWarning="The amount is below what you need to complete this booking."
						/>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}

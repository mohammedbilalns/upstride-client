import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { publicMentorProfileService } from "@/features/mentor-public-profile";

interface PublicMentorProfilePageProps {
	mentorId: string;
}

export function PublicMentorProfilePage({
	mentorId,
}: PublicMentorProfilePageProps) {
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		new Date(),
	);

	const profileQuery = useQuery({
		queryKey: ["public-mentor-profile", mentorId],
		queryFn: () => publicMentorProfileService.getPublicProfile(mentorId),
	});

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

	const profile = profileQuery.data?.data.profile;
	const nextAvailableSessions =
		profileQuery.data?.data.nextAvailableSessions ?? [];
	const availableSlots = slotsQuery.data?.data.slots ?? [];

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
		<div className="px-6 py-8 space-y-8">
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
									<Link to="/chat/$mentorId" params={{ mentorId }}>
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
										{slot.durationMinutes} mins · {slot.price} coins
									</p>
								</div>
								<Badge variant="secondary">Available</Badge>
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
								<Badge variant="secondary">Available</Badge>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

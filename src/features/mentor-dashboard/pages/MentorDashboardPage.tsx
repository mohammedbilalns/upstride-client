import { useQuery } from "@tanstack/react-query";
import { Coins } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { catalogService } from "@/features/catalog-management/services/catalog.service";
import { mentorProfileService } from "@/features/mentor-profile";
import { useMentorSessions } from "@/features/mentor-sessions/hooks/use-mentor-sessions";
import { EditMentorProfileModal } from "@/features/mentor-profile/components/EditMentorProfileModal";
import { UpcomingSessionsWidget } from "@/features/mentor-sessions/components/UpcomingSessionsWidget";

export function MentorDashboardPage() {
	const { data, isLoading } = useQuery({
		queryKey: ["mentor-profile"],
		queryFn: () => mentorProfileService.getProfile(),
	});
	const { data: catalogData } = useQuery({
		queryKey: ["catalog"],
		queryFn: () => catalogService.fetchCatalog(),
	});

	const profile = data?.data.profile;
	const upcomingParams = useMemo(
		() => ({ page: 1, limit: 5, filter: "upcoming" as const }),
		[],
	);
	const { data: upcomingSessions, isLoading: upcomingLoading } =
		useMentorSessions(upcomingParams);
	const upcomingItems = upcomingSessions?.data.items ?? [];
	const [isEditOpen, setIsEditOpen] = useState(false);

	return (
		<div className="p-8 space-y-6">
			<Card className="border-border/60 shadow-sm">
				<CardHeader className="pb-3">
					<CardTitle className="text-2xl">Mentor Dashboard</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<p className="text-muted-foreground">
						Manage your availability and upcoming sessions.
					</p>
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6">
				<Card className="border-border/60 shadow-sm">
					<CardHeader className="pb-3">
						<CardTitle className="text-xl">Profile Snapshot</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{isLoading && (
							<p className="text-sm text-muted-foreground">
								Loading profile...
							</p>
						)}
						{profile && (
							<div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
								<div className="space-y-2">
									<div className="flex items-center gap-3 flex-wrap">
										<h2 className="text-xl font-semibold">
											{profile.user.name}
										</h2>
										{profile.tierName && (
											<Badge variant="secondary">{profile.tierName}</Badge>
										)}
										<Button
											variant="outline"
											size="sm"
											onClick={() => setIsEditOpen(true)}
										>
											Edit Profile
										</Button>
									</div>
									<p className="text-sm text-muted-foreground">
										{profile.currentRole.name} • {profile.organization}
									</p>
									{profile.personalWebsite && (
										<p className="text-sm text-muted-foreground">
											{profile.personalWebsite}
										</p>
									)}
								</div>
								<div className="md:ml-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div className="p-4 border border-border/60 rounded-lg">
										<p className="text-xs text-muted-foreground">
											Current Price
										</p>
										<p className="text-lg font-semibold flex items-center gap-2">
											<Coins className="h-4 w-4 text-primary" />
											<span>{profile.currentPricePer30Min ?? 0}</span>
											<span className="text-sm text-muted-foreground">
												/ 30m
											</span>
										</p>
									</div>
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				<UpcomingSessionsWidget
					upcomingLoading={upcomingLoading}
					upcomingItems={upcomingItems}
				/>
			</div>

			<Card className="border-border/60 shadow-sm">
				<CardHeader>
					<CardTitle className="text-xl">Profile Details</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					{profile && (
						<div className="p-6 md:p-8 space-y-6">
							<div>
								<p className="text-sm font-medium">Bio</p>
								<p className="text-sm text-muted-foreground">{profile.bio}</p>
							</div>
							<div>
								<p className="text-sm font-medium">Expertises</p>
								<div className="flex flex-wrap gap-2 mt-2">
									{profile.expertises.map((exp) => (
										<Badge key={exp.id} variant="outline">
											{exp.name}
										</Badge>
									))}
								</div>
							</div>
							<div>
								<p className="text-sm font-medium">Skills</p>
								<div className="flex flex-wrap gap-2 mt-2">
									{profile.skills.map((skill) => (
										<Badge key={skill.id} variant="secondary">
											{skill.name} • {skill.level}
										</Badge>
									))}
								</div>
							</div>
							<div>
								<p className="text-sm font-medium">
									Educational Qualifications
								</p>
								<ul className="list-disc pl-6 text-sm text-muted-foreground mt-2">
									{profile.educationalQualifications.map((item) => (
										<li key={item}>{item}</li>
									))}
								</ul>
							</div>
						</div>
					)}
					{!profile && !isLoading && (
						<p className="text-muted-foreground p-6">No profile data found.</p>
					)}
				</CardContent>
			</Card>

			<EditMentorProfileModal
				isOpen={isEditOpen}
				onClose={setIsEditOpen}
				profile={profile}
				catalogData={catalogData}
			/>
		</div>
	);
}

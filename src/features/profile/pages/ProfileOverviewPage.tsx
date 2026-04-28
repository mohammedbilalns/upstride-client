import { useQuery } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { Coins, Mail, Pencil, Phone, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";
import { catalogService } from "@/features/catalog/services/catalog.service";
import { mentorProfileService } from "@/features/mentor-profile";
import { EditMentorProfileEditor } from "@/features/mentor-profile/components/EditMentorProfileEditor";
import { ProfileEditView, useProfile } from "@/features/profile";
import { EditPreferencesEditor } from "@/features/profile/components/EditPreferencesEditor";
import { ProfilePreferencesCard } from "@/features/profile/components/ProfilePreferencesCard";

export function ProfileOverviewPage() {
	const { data: profile, isLoading } = useProfile();
	const [isEditing, setIsEditing] = useState(false);
	const [isPreferencesEditing, setIsPreferencesEditing] = useState(false);
	const [isMentorEditing, setIsMentorEditing] = useState(false);
	const { auth } = useRouteContext({
		from: "/_app-layout/_user-layout/profile",
	});
	const isMentor = auth.user?.role === "MENTOR";
	const { data: mentorProfileResponse, isLoading: mentorProfileLoading } =
		useQuery({
			queryKey: ["mentor-profile"],
			queryFn: () => mentorProfileService.getProfile(),
			enabled: isMentor,
		});
	const { data: catalogData } = useQuery({
		queryKey: ["catalog"],
		queryFn: () => catalogService.fetchCatalog(),
		enabled: isMentor,
	});
	const mentorProfile = mentorProfileResponse?.data.profile;

	if (isLoading) {
		return (
			<div className="flex items-center justify-center p-12">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
			</div>
		);
	}

	if (!profile) {
		return (
			<Card className="border-destructive/20 bg-destructive/5 text-center p-8">
				<CardDescription>
					Could not load profile information. Please try again later.
				</CardDescription>
			</Card>
		);
	}

	return (
		<div className="animate-in fade-in duration-500 space-y-6">
			<div className="flex items-center gap-2.5">
				<div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
					<UserIcon className="h-4.5 w-4.5" />
				</div>
				<h2 className="text-xl font-semibold tracking-tight">
					Personal Profile
				</h2>
			</div>

			<div className="grid gap-6 lg:grid-cols-12">
				<div className="lg:col-span-12">
					{isEditing ? (
						<ProfileEditView
							profile={profile}
							onCancel={() => setIsEditing(false)}
						/>
					) : (
						<Card className="shadow-md overflow-hidden border-none bg-gradient-to-b from-primary/5 to-background">
							<CardHeader className="text-center pb-2 relative">
								<Button
									variant="ghost"
									size="icon"
									className="absolute top-2 right-2 rounded-full h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
									onClick={() => setIsEditing(true)}
								>
									<Pencil className="h-4 w-4" />
								</Button>
								<div className="flex justify-center mb-4">
									<Avatar className="h-32 w-32 border-4 border-background shadow-xl">
										<AvatarImage
											src={profile.profilePictureUrl || ""}
											alt={profile.name}
										/>
										<AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">
											{profile.name.charAt(0).toUpperCase()}
										</AvatarFallback>
									</Avatar>
								</div>
								<CardTitle className="text-2xl font-bold">
									{profile.name}
								</CardTitle>
								<Badge
									variant="secondary"
									className="w-fit mx-auto mt-2 px-4 py-1 font-semibold tracking-wide"
								>
									{profile.role}
								</Badge>
							</CardHeader>
							<CardContent className="space-y-4 pt-4">
								<div className="flex items-center gap-3 text-sm p-3 rounded-xl bg-background/50 border border-border/50 hover:bg-background transition-colors">
									<Mail className="h-4 w-4 text-primary shrink-0" />
									<div className="min-w-0">
										<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
											Email
										</p>
										<p className="truncate font-medium">{profile.email}</p>
									</div>
								</div>
								<div className="flex items-center gap-3 text-sm p-3 rounded-xl bg-background/50 border border-border/50 hover:bg-background transition-colors">
									<Phone className="h-4 w-4 text-primary shrink-0" />
									<div className="min-w-0">
										<p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
											Phone
										</p>
										<p className="truncate font-medium">
											{profile.phone || "Not provided"}
										</p>
									</div>
								</div>

								<Button
									variant="outline"
									className="w-full mt-4 rounded-xl font-bold text-sm h-11 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all group"
									onClick={() => setIsEditing(true)}
								>
									<Pencil className="h-3.5 w-3.5 mr-2 group-hover:scale-110 transition-transform" />
									Edit Profile
								</Button>
							</CardContent>
						</Card>
					)}
				</div>

				<div className="lg:col-span-12">
					{isPreferencesEditing ? (
						<EditPreferencesEditor
							profile={profile}
							onDone={() => setIsPreferencesEditing(false)}
							onCancel={() => setIsPreferencesEditing(false)}
						/>
					) : (
						<ProfilePreferencesCard
							profile={profile}
							onEdit={() => setIsPreferencesEditing(true)}
						/>
					)}
				</div>
			</div>

			{isMentor && (
				<div className="space-y-6">
					<Card className="border-border/60 shadow-sm">
						<CardHeader className="pb-3">
							<CardTitle className="text-xl"> Public Mentor Profile</CardTitle>
							<CardDescription>
								{" "}
								Information visible to mentees when they view your profile.
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{mentorProfileLoading && (
								<p className="text-sm text-muted-foreground">
									Loading mentor profile...
								</p>
							)}
							{isMentorEditing && mentorProfile ? (
								<EditMentorProfileEditor
									profile={mentorProfile}
									catalogData={catalogData}
									onDone={() => setIsMentorEditing(false)}
									onCancel={() => setIsMentorEditing(false)}
								/>
							) : mentorProfile ? (
								<div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] items-start">
									<div className="space-y-5">
										<div className="flex items-center gap-3 flex-wrap">
											<Button
												variant="outline"
												size="sm"
												onClick={() => setIsMentorEditing(true)}
											>
												Update Mentor Details
											</Button>
										</div>
										<div className="space-y-2">
											<p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
												Current Role
											</p>
											<p className="text-sm text-muted-foreground">
												{mentorProfile.currentRole.name} •{" "}
												{mentorProfile.organization}
											</p>
										</div>
										{mentorProfile.personalWebsite && (
											<div className="space-y-2">
												<p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
													Website
												</p>
												<p className="text-sm text-muted-foreground">
													{mentorProfile.personalWebsite}
												</p>
											</div>
										)}
										<div className="space-y-2">
											<p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
												Bio
											</p>
											<p className="text-sm text-muted-foreground">
												{mentorProfile.bio}
											</p>
										</div>
										<div className="space-y-2">
											<p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
												Areas of Interest
											</p>
											<div className="flex flex-wrap gap-2">
												{mentorProfile.expertises.map((exp) => (
													<Badge key={exp.id} variant="outline">
														{exp.name}
													</Badge>
												))}
											</div>
										</div>
										<div className="space-y-2">
											<p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
												Skills & Proficiency
											</p>
											<div className="flex flex-wrap gap-2">
												{mentorProfile.skills.map((skill) => (
													<Badge key={skill.id} variant="secondary">
														{skill.name} • {skill.level}
													</Badge>
												))}
											</div>
										</div>
										<div className="space-y-2">
											<p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
												Academic Background
											</p>
											<ul className="list-disc pl-6 text-sm text-muted-foreground">
												{mentorProfile.educationalQualifications.map((item) => (
													<li key={item}>{item}</li>
												))}
											</ul>
										</div>
									</div>
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div className="p-4 border border-border/60 rounded-lg">
											<p className="text-xs text-muted-foreground">
												Session Rate Per 30 minute
											</p>
											<p className="text-lg font-semibold flex items-center gap-2">
												<Coins className="h-4 w-4 text-primary" />
												<span>{mentorProfile.currentPricePer30Min ?? 0}</span>
												<span className="text-sm text-muted-foreground">
													/ 30m
												</span>
											</p>
										</div>
									</div>
								</div>
							) : null}
							{!mentorProfile && !mentorProfileLoading && (
								<p className="text-sm text-muted-foreground">
									No mentor profile data found.
								</p>
							)}
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
}

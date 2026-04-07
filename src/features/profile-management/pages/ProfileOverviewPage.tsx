import {
	Award,
	Briefcase,
	Mail,
	Pencil,
	Phone,
	User as UserIcon,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProfileEditView, useProfile } from "@/features/profile-management";

export function ProfileOverviewPage() {
	const { data: profile, isLoading } = useProfile();
	const [isEditing, setIsEditing] = useState(false);

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

	if (isEditing) {
		return (
			<ProfileEditView profile={profile} onCancel={() => setIsEditing(false)} />
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

			<div className="grid gap-6 lg:grid-cols-3">
				<Card className="lg:col-span-1 shadow-md overflow-hidden border-none bg-gradient-to-b from-primary/5 to-background">
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
						<CardTitle className="text-2xl font-bold">{profile.name}</CardTitle>
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

				<Card className="lg:col-span-2 shadow-md border-none overflow-hidden">
					<CardHeader className="bg-primary/5 border-b border-primary/10">
						<div className="flex items-center gap-2">
							<div className="p-2 rounded-lg bg-primary/10">
								<Award className="h-5 w-5 text-primary" />
							</div>
							<div>
								<CardTitle className="text-xl text-zinc-900 dark:text-zinc-50">
									Expertise & Skills
								</CardTitle>
								<CardDescription>
									Your areas of interest and associated proficiency levels.
								</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent className="pt-6 space-y-8">
						{profile.preferences?.interests &&
						profile.preferences.interests.length > 0 ? (
							<div className="grid gap-6">
								{profile.preferences.interests.map((interest: any) => (
									<div key={interest.id} className="space-y-4 group">
										<div className="flex items-center gap-3">
											<div className="h-8 w-1 rounded-full bg-primary" />
											<h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
												{interest.name}
											</h4>
										</div>

										<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2 ml-4">
											{interest.skills && interest.skills.length > 0 ? (
												interest.skills.map((skill: any) => (
													<div
														key={skill.skillId}
														className="flex items-center justify-between p-3 rounded-xl bg-secondary/30 border border-transparent hover:border-primary/20 hover:bg-secondary/50 transition-all duration-200"
													>
														<span className="font-medium text-sm">
															{skill.name}
														</span>
														<Badge
															variant={
																skill.level === "ADVANCED"
																	? "default"
																	: "outline"
															}
															className="text-[10px] h-5 px-2 font-bold"
														>
															{skill.level}
														</Badge>
													</div>
												))
											) : (
												<p className="text-sm text-muted-foreground italic col-span-full">
													No specific skills listed for this interest.
												</p>
											)}
										</div>
										<Separator className="mt-6 opacity-50 last:hidden" />
									</div>
								))}
							</div>
						) : (
							<div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
								<div className="p-4 rounded-full bg-secondary/30 mb-4">
									<Briefcase className="h-8 w-8 opacity-20" />
								</div>
								<p>You haven't added any interests or skills yet.</p>
								<p className="text-sm">
									Complete your profile to showcase your expertise.
								</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

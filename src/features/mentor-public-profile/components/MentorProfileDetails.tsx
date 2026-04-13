import { Link } from "@tanstack/react-router";
import { Flag } from "lucide-react";
import { ReportDialog } from "@/components/common/ReportDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { UserProfile } from "@/features/profile-management/types";
import type { PublicMentorProfile } from "../types";

interface MentorProfileDetailsProps {
	profile: PublicMentorProfile;
	isAdminView: boolean;
	currentUser: UserProfile | null | undefined;
	isReported: boolean;
}

export function MentorProfileDetails({
	profile,
	isAdminView,
	currentUser,
	isReported,
}: MentorProfileDetailsProps) {
	return (
		<Card className="border-border/60 shadow-sm h-fit">
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
							<h1 className="text-2xl font-semibold">{profile.user.name}</h1>
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
	);
}

import { Pencil, Target } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { UserProfile } from "../types";

interface ProfilePreferencesCardProps {
	profile: UserProfile;
	onEdit: () => void;
}

export function ProfilePreferencesCard({
	profile,
	onEdit,
}: ProfilePreferencesCardProps) {
	const preferences = profile.preferences?.interests ?? [];
	const totalSkills = preferences.reduce(
		(count, interest) => count + interest.skills.length,
		0,
	);

	return (
		<Card className="border-border/60 shadow-sm overflow-hidden">
			<CardHeader className="pb-3 flex flex-row items-start justify-between gap-3">
				<div className="space-y-1">
					<CardTitle className="flex items-center gap-2 text-xl">
						<Target className="h-5 w-5 text-primary" />
						Areas of Interest & Expertise
					</CardTitle>
					<p className="text-sm text-muted-foreground">
						Topics you’re interested in and skills you offer or want to develop.
					</p>
				</div>
				<Button
					variant="outline"
					size="sm"
					onClick={onEdit}
					className="rounded-full"
				>
					<Pencil className="h-3.5 w-3.5 mr-2" />
					Edit Preferences
				</Button>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex flex-wrap gap-2">
					<Badge variant="secondary" className="rounded-full px-3 py-1">
						{preferences.length} interests
					</Badge>
					<Badge variant="outline" className="rounded-full px-3 py-1">
						{totalSkills} skills
					</Badge>
				</div>

				{preferences.length === 0 ? (
					<p className="text-sm text-muted-foreground">
						No preferences selected yet. Add your interests and skills to
						personalize recommendations.
					</p>
				) : (
					<div className="grid gap-3 md:grid-cols-2">
						{preferences.map((interest) => (
							<div
								key={interest.id}
								className="rounded-2xl border border-border/60 bg-muted/20 p-3 space-y-2"
							>
								<div className="flex items-center justify-between gap-2">
									<p className="text-sm font-semibold">{interest.name}</p>
									<Badge variant="outline" className="rounded-full text-[10px]">
										{interest.skills.length}
									</Badge>
								</div>
								<div className="flex flex-wrap gap-1.5">
									{interest.skills.map((skill) => (
										<Badge
											key={skill.skillId}
											variant="secondary"
											className="rounded-full px-2 py-0.5 text-[11px]"
										>
											{skill.name}
										</Badge>
									))}
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

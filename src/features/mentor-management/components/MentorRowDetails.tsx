import { Briefcase, ExternalLink, Globe, User as UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Mentor } from "@/shared/types/mentor";

interface MentorRowDetailsProps {
	mentor: Mentor;
}

export function MentorRowDetails({ mentor }: MentorRowDetailsProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-top-2 duration-300">
			<div className="space-y-4">
				<div>
					<div className="flex items-center justify-between mb-2">
						<h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
							<UserIcon className="w-4 h-4" />
							Professional Bio
						</h4>
						{mentor.resubmissionCount > 1 && (
							<Badge
								variant="outline"
								className="text-[10px] bg-amber-500/5 text-amber-600 border-amber-500/20"
							>
								Resubmitted {mentor.resubmissionCount - 1} times
							</Badge>
						)}
					</div>
					<p className="text-sm leading-relaxed text-foreground/80 bg-background/50 p-4 rounded-lg border italic whitespace-pre-wrap">
						{mentor.bio || "No bio provided."}
					</p>
				</div>

				<div className="flex gap-4 pt-2">
					{mentor.personalWebsite && (
						<Button
							variant="outline"
							size="sm"
							className="flex-1 gap-2"
							asChild
						>
							<a
								href={mentor.personalWebsite}
								target="_blank"
								rel="noopener noreferrer"
							>
								<Globe className="w-4 h-4" />
								Portfolio
							</a>
						</Button>
					)}
					<Button variant="outline" size="sm" className="flex-1 gap-2" asChild>
						<a
							href={mentor.resumeUrl}
							target="_blank"
							rel="noopener noreferrer"
						>
							<ExternalLink className="w-4 h-4" />
							Resume
						</a>
					</Button>
				</div>
			</div>

			<div className="space-y-6">
				<h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2">
					<Briefcase className="w-4 h-4" />
					Expertises & Skills
				</h4>
				<div className="space-y-6">
					{mentor.expertises.map((exp) => (
						<div key={exp.name} className="space-y-3">
							<div className="flex items-center gap-2">
								<Badge
									variant="secondary"
									className="px-3 py-1 text-xs font-semibold uppercase tracking-wider"
								>
									{exp.name}
								</Badge>
								<div className="h-[1px] flex-1 bg-border/50" />
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
								{exp.skills.map((skill) => (
									<div
										key={skill.name}
										className="flex items-center justify-between text-sm bg-background/50 px-3 py-2 rounded-lg border group/skill hover:border-primary/30 transition-colors"
									>
										<span className="font-medium">{skill.name}</span>
										<Badge
											variant="outline"
											className="text-[10px] bg-muted/30"
										>
											{skill.level}
										</Badge>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

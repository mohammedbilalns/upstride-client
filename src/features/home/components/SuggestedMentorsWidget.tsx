import { UserPlus } from "lucide-react";
import type { MentorDiscoveryItem } from "@/features/mentor-discovery/types";

interface SuggestedMentorsWidgetProps {
	mentors?: MentorDiscoveryItem[];
}

export function SuggestedMentorsWidget({
	mentors = [],
}: SuggestedMentorsWidgetProps) {
	return (
		<div className="rounded-xl bg-card border border-border p-6 flex flex-col space-y-4">
			<h3 className="font-semibold text-lg">Suggested Mentors</h3>
			{mentors.length === 0 ? (
				<div className="flex flex-col items-center justify-center text-center py-6 text-muted-foreground space-y-2">
					<UserPlus className="h-8 w-8 opacity-50" />
					<span className="text-sm">No new suggestions today.</span>
				</div>
			) : (
				<div className="space-y-4">
					{mentors.map((mentor) => (
						<div key={mentor.userId} className="flex items-center gap-3">
							<img
								src={
									mentor.avatar ||
									`https://ui-avatars.com/api/?name=${mentor.name.replace(/ /g, "+")}`
								}
								alt={mentor.name}
								className="h-10 w-10 rounded-full bg-muted object-cover"
							/>
							<div className="flex-1 overflow-hidden">
								<h4 className="text-sm font-medium truncate">{mentor.name}</h4>
								<p className="text-xs text-muted-foreground truncate">
									{mentor.designation || "Mentor"}
								</p>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

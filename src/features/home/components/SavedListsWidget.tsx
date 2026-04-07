import { Folder } from "lucide-react";
import type { MentorList } from "@/features/mentor-discovery/types";
import { Link } from "@tanstack/react-router";

interface SavedListsWidgetProps {
	lists?: MentorList[];
}

export function SavedListsWidget({ lists = [] }: SavedListsWidgetProps) {
	return (
		<div className="rounded-xl bg-card border border-border p-6 flex flex-col space-y-4">
			<h3 className="font-semibold text-lg">Saved Lists</h3>
			{lists.length === 0 ? (
				<div className="text-sm text-muted-foreground text-center py-4">
					You have no saved lists.
				</div>
			) : (
				<div className="space-y-3">
					{lists.map((list) => (
						<Link
							to="/profile/bookmarked-mentors"
							key={list.id}
							className="flex items-center justify-between text-sm group cursor-pointer"
						>
							<div className="flex items-center gap-3 text-muted-foreground group-hover:text-foreground transition-colors overflow-hidden">
								<Folder className="h-4 w-4 shrink-0" />
								<span className="truncate">{list.name}</span>
							</div>
							<span className="text-xs text-muted-foreground/60 shrink-0 ml-2">
								{list.mentorCount ?? 0}
							</span>
						</Link>
					))}
				</div>
			)}
			{lists.length > 0 && (
				<Link
					to="/profile/bookmarked-mentors"
					className="text-sm text-primary font-medium hover:underline pt-2 text-center"
				>
					View More
				</Link>
			)}
		</div>
	);
}

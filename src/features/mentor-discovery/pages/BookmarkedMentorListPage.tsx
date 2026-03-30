import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Bookmark } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { BookmarkMentorCard } from "../components/BookmarkMentorCard";
import { useMentorList } from "../hooks/use-mentor-lists";

export function BookmarkedMentorListPage() {
	const { listId } = useParams({
		from: "/_app-layout/_user-layout/profile/bookmarked-mentors/$listId",
	});
	const { data, isLoading } = useMentorList(listId);
	const list = data?.list;
	const [removedMentorIds, setRemovedMentorIds] = useState<string[]>([]);
	const mentors = useMemo(() => {
		const items = list?.mentors ?? [];
		if (removedMentorIds.length === 0) return items;
		return items.filter((mentor) => !removedMentorIds.includes(mentor.id));
	}, [list?.mentors, removedMentorIds]);

	return (
		<div className="container mx-auto px-6 py-8 space-y-6">
			<div className="flex items-start justify-between gap-6">
				<div className="flex items-start gap-4">
					<Button asChild variant="ghost" size="icon">
						<Link to="/profile/bookmarked-mentors">
							<ArrowLeft className="h-4 w-4" />
						</Link>
					</Button>
					<div>
						<div className="flex items-center gap-2">
							<Bookmark className="h-5 w-5 text-amber-500" />
							<h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
								{list?.name || "Saved mentors"}
							</h1>
						</div>
						<p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
							{list?.description || "Mentors saved to this list."}
						</p>
						{list && (
							<p className="text-xs text-zinc-500 mt-2">
								{list.mentorCount ?? mentors.length} mentors
							</p>
						)}
					</div>
				</div>
				<Button asChild variant="outline">
					<Link to="/mentors" search={{ sort: "rating" }}>
						Find more mentors
					</Link>
				</Button>
			</div>

			{isLoading && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
					{Array.from({ length: 8 }).map((_, i) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
							key={i}
							className="h-72 rounded-lg bg-zinc-100 dark:bg-zinc-900 animate-pulse"
						/>
					))}
				</div>
			)}

			{!isLoading && mentors.length === 0 && (
				<div className="flex flex-col items-center justify-center py-20 text-center">
					<div className="h-16 w-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-4">
						<Bookmark className="h-7 w-7 text-zinc-400" />
					</div>
					<h3 className="text-base font-medium text-zinc-800 dark:text-zinc-200 mb-1">
						No mentors saved yet
					</h3>
					<p className="text-sm text-zinc-500">
						Add mentors to this list to see them here.
					</p>
				</div>
			)}

			{!isLoading && mentors.length > 0 && (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
					{mentors.map((mentor) => (
						<BookmarkMentorCard
							key={mentor.id}
							mentor={mentor}
							listId={listId}
							onRemoved={(mentorId) =>
								setRemovedMentorIds((prev) => [...prev, mentorId])
							}
						/>
					))}
				</div>
			)}
		</div>
	);
}

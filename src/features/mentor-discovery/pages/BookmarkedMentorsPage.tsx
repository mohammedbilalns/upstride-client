import { Link } from "@tanstack/react-router";
import { Bookmark, FolderOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useMentorLists } from "../hooks/use-mentor-lists";

export function BookmarkedMentorsPage() {
	const { data, isLoading } = useMentorLists();
	const lists = data?.items ?? [];

	return (
		<div className="container mx-auto px-6 py-8 space-y-6">
			<div className="flex items-center gap-3">
				<div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 flex items-center justify-center">
					<Bookmark className="h-5 w-5" />
				</div>
				<div>
					<h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
						Bookmarked Mentors
					</h1>
					<p className="text-sm text-zinc-500 dark:text-zinc-400">
						Open a list to see all saved mentors.
					</p>
				</div>
			</div>

			{isLoading && (
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
					{Array.from({ length: 6 }).map((_, i) => (
						<div
							// biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholder
							key={i}
							className="h-40 rounded-2xl bg-zinc-100 dark:bg-zinc-900 animate-pulse"
						/>
					))}
				</div>
			)}

			{!isLoading && lists.length === 0 && (
				<Card className="border-dashed">
					<CardHeader>
						<CardTitle className="text-base">No bookmarks yet</CardTitle>
						<CardDescription>
							Save mentors into a list to see them here.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button asChild variant="outline">
							<Link to="/mentors">Find mentors</Link>
						</Button>
					</CardContent>
				</Card>
			)}

			{!isLoading && lists.length > 0 && (
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
					{lists.map((list) => (
						<Card
							key={list.id}
							className="group hover:border-zinc-300 dark:hover:border-zinc-800 transition-colors"
						>
							<CardHeader className="space-y-2">
								<div className="flex items-start justify-between gap-4">
									<div>
										<CardTitle className="text-lg">{list.name}</CardTitle>
										<CardDescription className="line-clamp-2">
											{list.description || "Saved mentors list"}
										</CardDescription>
									</div>
									<div className="rounded-full bg-zinc-100 dark:bg-zinc-900 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300 flex items-center gap-1">
										<Users className="h-3.5 w-3.5" />
										<span>{list.mentorCount ?? 0}</span>
									</div>
								</div>
							</CardHeader>
							<CardContent className="pt-0">
								<Button asChild className="w-full">
									<Link
										to="/profile/bookmarked-mentors/$listId"
										params={{ listId: list.id }}
									>
										<FolderOpen className="h-4 w-4 mr-2" />
										Open list
									</Link>
								</Button>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}

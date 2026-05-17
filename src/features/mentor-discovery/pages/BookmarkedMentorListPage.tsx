import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Bookmark } from "lucide-react";
import { useMemo, useState } from "react";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Button } from "@/components/ui/Button";
import { BookmarkMentorCard } from "../components/BookmarkMentorCard";
import { useDeleteMentorList } from "../hooks/mutations/useMentorListMutations";
import { mentorListKeys, useMentorList } from "../hooks/queries/useMentorLists";
import type { GetMentorListsResponse } from "../types";

export function BookmarkedMentorListPage() {
	const { listId } = useParams({
		from: "/_app-layout/_user-layout/profile/bookmarked-mentors/$listId",
	});
	const navigate = useNavigate();
	const { data, isLoading } = useMentorList(listId);
	const list = data?.list;
	const [removedMentorIds, setRemovedMentorIds] = useState<string[]>([]);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const deleteList = useDeleteMentorList();
	const queryClient = useQueryClient();
	const mentors = useMemo(() => {
		const items = list?.mentors ?? [];
		if (removedMentorIds.length === 0) return items;
		return items.filter((mentor) => !removedMentorIds.includes(mentor.id));
	}, [list?.mentors, removedMentorIds]);

	const handleDelete = () => {
		deleteList.mutate(
			{ listId },
			{
				onSuccess: () => {
					queryClient.setQueryData<GetMentorListsResponse>(
						mentorListKeys.lists(),
						(prev) => {
							if (!prev) return prev;
							return {
								...prev,
								items: prev.items.filter((item) => item.id !== listId),
							};
						},
					);
					queryClient.removeQueries({ queryKey: mentorListKeys.list(listId) });
					navigate({ to: "/profile/bookmarked-mentors" });
				},
			},
		);
	};

	return (
		<div className="container mx-auto px-4 py-6 space-y-6 sm:px-6 sm:py-8">
			<div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-start lg:justify-between">
				<div className="flex min-w-0 items-start gap-3 sm:gap-4">
					<Button asChild variant="ghost" size="icon">
						<Link to="/profile/bookmarked-mentors">
							<ArrowLeft className="h-4 w-4" />
						</Link>
					</Button>
					<div className="min-w-0">
						<div className="flex min-w-0 items-center gap-2">
							<Bookmark className="h-5 w-5 shrink-0 text-amber-500" />
							<h1 className="truncate text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-50">
								{list?.name || "Saved mentors"}
							</h1>
						</div>
						<p className="mt-1 break-words text-sm text-zinc-500 dark:text-zinc-400">
							{list?.description || "Mentors saved to this list."}
						</p>
						{list && (
							<p className="mt-2 text-xs text-zinc-500">
								{list.mentorCount ?? mentors.length} mentors
							</p>
						)}
					</div>
				</div>
				<div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap lg:justify-end">
					<Button
						variant="outline"
						className="w-full sm:w-auto"
						onClick={() => setIsDeleteOpen(true)}
						disabled={deleteList.isPending}
					>
						Delete list
					</Button>
					<Button asChild variant="outline" className="w-full sm:w-auto">
						<Link to="/mentors" search={{}}>
							Find more mentors
						</Link>
					</Button>
				</div>
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

			<ConfirmModal
				isOpen={isDeleteOpen}
				onClose={() => setIsDeleteOpen(false)}
				onConfirm={handleDelete}
				title="Delete Mentor List"
				message="Are you sure you want to delete this mentor list? This cannot be undone."
				variant="destructive"
				isLoading={deleteList.isPending}
				confirmText="Delete"
			/>
		</div>
	);
}

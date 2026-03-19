import { BookmarkX } from "lucide-react";
import { useState } from "react";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { Button } from "@/components/ui/button";
import { useRemoveMentorFromList } from "../hooks/use-mentor-list-mutations";
import type { MentorDiscoveryItem } from "../types";
import { MentorCard } from "./MentorCard";

interface BookmarkMentorCardProps {
	mentor: MentorDiscoveryItem;
	listId: string;
	onRemoved: (mentorId: string) => void;
}

export function BookmarkMentorCard({
	mentor,
	listId,
	onRemoved,
}: BookmarkMentorCardProps) {
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const removeMentor = useRemoveMentorFromList();

	const handleRemove = async () => {
		removeMentor.mutate(
			{ listId, mentorId: mentor.id },
			{
				onSuccess: () => {
					setIsConfirmOpen(false);
					onRemoved(mentor.id);
				},
			},
		);
	};

	return (
		<div className="relative">
			<div className="absolute right-4 top-4 z-10">
				<Button
					variant="outline"
					size="icon"
					className="text-zinc-500 h-9 w-9 bg-background/80 backdrop-blur-sm"
					onClick={() => setIsConfirmOpen(true)}
				>
					<BookmarkX className="h-4 w-4" />
				</Button>
			</div>

			<MentorCard mentor={mentor} showBookmark={false} />

			<ConfirmModal
				isOpen={isConfirmOpen}
				onClose={() => setIsConfirmOpen(false)}
				onConfirm={handleRemove}
				title="Remove mentor"
				message="Are you sure you want to remove this mentor from the list?"
				confirmText="Remove"
				variant="destructive"
				isLoading={removeMentor.isPending}
			/>
		</div>
	);
}

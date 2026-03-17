import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { MentorList } from "../types";
import {
	useAddMentorToList,
	useCreateMentorList,
	useFetchMentorLists,
} from "../hooks/use-mentor-list-mutations";

interface MentorListDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	mentorId: string;
}

export function MentorListDialog({
	open,
	onOpenChange,
	mentorId,
}: MentorListDialogProps) {
	const [lists, setLists] = useState<MentorList[]>([]);
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");

	const fetchLists = useFetchMentorLists();
	const createList = useCreateMentorList();
	const addMentor = useAddMentorToList();

	const isBusy = useMemo(
		() => fetchLists.isPending || createList.isPending || addMentor.isPending,
		[fetchLists.isPending, createList.isPending, addMentor.isPending],
	);

	useEffect(() => {
		if (!open) return;
		fetchLists.mutate(undefined, {
			onSuccess: (data) => {
				setLists(data.items);
			},
		});
	}, [open]);

	const resetCreateForm = () => {
		setName("");
		setDescription("");
		setIsCreateOpen(false);
	};

	const handleCreate = () => {
		const trimmedName = name.trim();
		if (!trimmedName) return;
		createList.mutate(
			{
				name: trimmedName,
				description: description.trim() ? description.trim() : null,
			},
			{
				onSuccess: (data) => {
					setLists((prev) => [data.list, ...prev]);
					resetCreateForm();
				},
			},
		);
	};

	const handleAddMentor = (listId: string) => {
		addMentor.mutate(
			{ listId, mentorId },
			{
				onSuccess: () => {
					onOpenChange(false);
				},
			},
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[520px]">
				<DialogHeader>
					<DialogTitle>Save Mentor</DialogTitle>
				</DialogHeader>

				<div className="space-y-4">
					<div className="flex items-center justify-between gap-3">
						<p className="text-sm text-zinc-500">Choose a list to save to.</p>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setIsCreateOpen((prev) => !prev)}
							disabled={isBusy}
						>
							Create List
						</Button>
					</div>

					{isCreateOpen && (
						<div className="space-y-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
							<div className="space-y-2">
								<Label htmlFor="mentor-list-name">Name</Label>
								<Input
									id="mentor-list-name"
									value={name}
									onChange={(e) => setName(e.target.value)}
									placeholder="Enter list name "
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="mentor-list-desc">Description</Label>
								<Input
									id="mentor-list-desc"
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									placeholder="Optional description"
								/>
							</div>
							<div className="flex items-center justify-end gap-2">
								<Button
									variant="ghost"
									size="sm"
									onClick={resetCreateForm}
									disabled={isBusy}
								>
									Cancel
								</Button>
								<Button size="sm" onClick={handleCreate} disabled={isBusy}>
									Save
								</Button>
							</div>
						</div>
					)}

					<div className="max-h-64 overflow-y-auto space-y-2">
						{fetchLists.isPending && (
							<p className="text-sm text-zinc-500">Loading lists...</p>
						)}
						{!fetchLists.isPending && lists.length === 0 && (
							<p className="text-sm text-zinc-500">
								No lists yet. Create your first list.
							</p>
						)}
						{lists.map((list) => (
							<button
								key={list.id}
								type="button"
								onClick={() => handleAddMentor(list.id)}
								disabled={isBusy}
								className="w-full text-left rounded-lg border border-zinc-200 px-4 py-3 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-900/50"
							>
								<div className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
									{list.name}
								</div>
								{list.description && (
									<div className="text-xs text-zinc-500 mt-1">
										{list.description}
									</div>
								)}
							</button>
						))}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

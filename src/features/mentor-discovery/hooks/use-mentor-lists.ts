import { useQuery } from "@tanstack/react-query";
import { mentorListsService } from "../services/mentor-lists.service";

export const mentorListKeys = {
	all: ["mentor-lists"] as const,
	lists: () => [...mentorListKeys.all, "lists"] as const,
	list: (listId: string) => [...mentorListKeys.all, "list", listId] as const,
};

export function useMentorLists() {
	return useQuery({
		queryKey: mentorListKeys.lists(),
		queryFn: () => mentorListsService.getLists(),
	});
}

export function useMentorList(listId: string) {
	return useQuery({
		queryKey: mentorListKeys.list(listId),
		queryFn: () => mentorListsService.getList(listId),
		enabled: Boolean(listId),
	});
}

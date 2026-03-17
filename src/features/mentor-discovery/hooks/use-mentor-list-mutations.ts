import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/api/apiError";
import { mentorListsService } from "../services/mentor-lists.service";
import type { AddMentorToListInput, CreateMentorListInput } from "../types";

export function useFetchMentorLists() {
	return useMutation({
		mutationFn: () => mentorListsService.getLists(),
		onError: (error: ApiError) => {
			toast.error(
				error.response?.data?.message || "Failed to load mentor lists",
			);
		},
	});
}

export function useCreateMentorList() {
	return useMutation({
		mutationFn: (input: CreateMentorListInput) =>
			mentorListsService.createList(input),
		onSuccess: () => {
			toast.success("Mentor list created");
		},
		onError: (error: ApiError) => {
			toast.error(
				error.response?.data?.message || "Failed to create mentor list",
			);
		},
	});
}

export function useAddMentorToList() {
	return useMutation({
		mutationFn: (input: AddMentorToListInput) =>
			mentorListsService.addMentor(input),
		onSuccess: () => {
			toast.success("Mentor saved to list");
		},
		onError: (error: ApiError) => {
			toast.error(
				error.response?.data?.message || "Failed to save mentor to list",
			);
		},
	});
}

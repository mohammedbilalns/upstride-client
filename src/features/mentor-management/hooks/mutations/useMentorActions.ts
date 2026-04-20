import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/api/apiError";
import type { RejectMentorInput } from "@/shared/types/mentor";
import { MentorManagementService } from "../../../user-management/services/mentor.service";

export function useApproveMentor() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => MentorManagementService.approveApplication(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["mentor-applications"] });
			toast.success("Mentor application approved successfully");
		},
		onError: (error: ApiError) => {
			toast.error(error.response?.data?.message || "Failed to approve mentor");
		},
	});
}

export function useRejectMentor() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: RejectMentorInput) =>
			MentorManagementService.rejectApplication(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["mentor-applications"] });
			toast.success("Mentor application rejected successfully");
		},
		onError: (error: ApiError) => {
			toast.error(error.response?.data?.message || "Failed to reject mentor");
		},
	});
}

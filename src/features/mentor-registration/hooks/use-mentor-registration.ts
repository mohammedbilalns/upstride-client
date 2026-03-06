import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { mentorRegistrationService } from "../services/mentor-registration.service";

export const useMentorRegistrationInfo = () => {
	return useQuery({
		queryKey: ["mentor-registration-info"],
		queryFn: mentorRegistrationService.getRegistrationInfo,
	});
};

export const useRegisterMentor = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: mentorRegistrationService.register,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["mentor-registration-info"] });
			toast.success("Application submitted successfully!");
			navigate({ to: "/home" });
		},
		onError: (err: any) => {
			toast.error(
				err.response?.data?.message || "Failed to submit application.",
			);
		},
	});
};

export const useResubmitMentor = () => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	return useMutation({
		mutationFn: mentorRegistrationService.resubmit,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["mentor-registration-info"] });
			toast.success("Application updated successfully!");
			navigate({ to: "/home" });
		},
		onError: (err: any) => {
			toast.error(
				err.response?.data?.message || "Failed to update application.",
			);
		},
	});
};

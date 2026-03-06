import {
	keepPreviousData,
	queryOptions,
	useQuery,
} from "@tanstack/react-query";
import { MentorManagementService } from "../../user-management/services/mentor-management.service";
import type { GetMentorApplicationsInput } from "@/shared/types/mentor";

export const mentorManagementQueryOptions = (
	params: GetMentorApplicationsInput,
) =>
	queryOptions({
		queryKey: ["mentor-applications", params],
		queryFn: () => MentorManagementService.getApplications(params),
		placeholderData: keepPreviousData,
	});

export function useMentors(params: GetMentorApplicationsInput) {
	return useQuery(mentorManagementQueryOptions(params));
}

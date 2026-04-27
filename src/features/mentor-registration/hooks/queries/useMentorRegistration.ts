import { queryOptions, useQuery } from "@tanstack/react-query";
import { catalogService } from "../../services/catalog.service";
import { mentorRegistrationService } from "../../services/registration.service";

export const useMentorRegistrationInfo = () => {
	return useQuery({
		queryKey: ["mentor-registration-info"],
		queryFn: mentorRegistrationService.getRegistrationInfo,
	});
};

export const professionsQueryOptions = queryOptions({
	queryKey: ["professions"],
	queryFn: async () => {
		const response = await catalogService.getProfessions();
		return response.data;
	},
});

import { queryOptions, useQuery } from "@tanstack/react-query";
import { profileService } from "../services/profile.service";

export const profileQueryOptions = queryOptions({
	queryKey: ["profile"],
	queryFn: async () => {
		const response = await profileService.getProfile();
		return response.data.profile;
	},
	staleTime: 1000 * 60 * 5, // 5 minutes
});

export const useProfile = () => {
	return useQuery(profileQueryOptions);
};

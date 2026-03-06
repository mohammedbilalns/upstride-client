import { useQuery } from "@tanstack/react-query";
import { catalogService } from "../services/catalog.service";

export const useProfessions = () => {
	return useQuery({
		queryKey: ["professions"],
		queryFn: async () => {
			const response = await catalogService.getProfessions();
			return response.data;
		},
		staleTime: 1000 * 60 * 60,
	});
};

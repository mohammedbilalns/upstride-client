import { queryOptions, useQuery } from "@tanstack/react-query";
import { catalogService } from "../../services/catalog.service";

export const catalogQueryOptions = queryOptions({
	queryKey: ["catalog"],
	queryFn: () => catalogService.fetchCatalog(),
});

export function useCatalog() {
	return useQuery(catalogQueryOptions);
}

import { createFileRoute } from "@tanstack/react-router";
import { CatalogManagementPage } from "@/features/catalog-management/pages/CatalogManagementPage";
import { catalogQueryOptions } from "@/features/catalog-management/hooks/use-catalog";
import { catalogSearchSchema } from "@/features/catalog-management/validators/catalog.schema";

export const Route = createFileRoute("/_admin-layout/catalog-management")({
	validateSearch: (search) => catalogSearchSchema.parse(search),
	loader: ({ context: { queryClient } }) =>
		queryClient.ensureQueryData(catalogQueryOptions),
	component: CatalogManagementPage,
});

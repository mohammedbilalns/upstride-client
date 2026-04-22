import { createFileRoute } from "@tanstack/react-router";
import { catalogQueryOptions } from "@/features/catalog/hooks/queries/useCatalog";
import { CatalogManagementPage } from "@/features/catalog/pages/CatalogManagementPage";
import { catalogSearchSchema } from "@/features/catalog/validators/catalog.schema";

export const Route = createFileRoute("/_admin-layout/catalog-management")({
	validateSearch: (search) => catalogSearchSchema.parse(search),
	loader: ({ context: { queryClient } }) =>
		queryClient.ensureQueryData(catalogQueryOptions),
	component: CatalogManagementPage,
});

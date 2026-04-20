import { createFileRoute } from "@tanstack/react-router";
import { platformSettingsQueryOptions } from "@/features/platform-settings/hooks/queries/usePlatformSettings";
import { PlatformSettingsPage } from "@/features/platform-settings/pages/PlatformSettingsPage";
import { platformSettingsSearchSchema } from "@/features/platform-settings/validators/platform-settings.schema";

export const Route = createFileRoute("/_admin-layout/platform-settings")({
	validateSearch: (search) => platformSettingsSearchSchema.parse(search),
	loader: ({ context: { queryClient } }) =>
		queryClient.ensureQueryData(platformSettingsQueryOptions),
	component: PlatformSettingsPage,
});

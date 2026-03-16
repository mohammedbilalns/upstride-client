import { createFileRoute } from "@tanstack/react-router";
import { PlatformSettingsPage } from "@/features/platform-settings/pages/PlatformSettingsPage";
import { platformSettingsQueryOptions } from "@/features/platform-settings/hooks/use-platform-settings";
import { platformSettingsSearchSchema } from "@/features/platform-settings/validators/platform-settings.schema";

export const Route = createFileRoute("/_admin-layout/platform-settings")({
	validateSearch: (search) => platformSettingsSearchSchema.parse(search),
	loader: ({ context: { queryClient } }) =>
		queryClient.ensureQueryData(platformSettingsQueryOptions),
	component: PlatformSettingsPage,
});

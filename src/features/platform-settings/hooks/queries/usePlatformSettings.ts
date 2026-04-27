import { queryOptions, useQuery } from "@tanstack/react-query";
import { platformSettingsService } from "../../services/settings.service";

export const PLATFORM_SETTINGS_KEYS = {
	all: ["platform-settings"] as const,
};

export const platformSettingsQueryOptions = queryOptions({
	queryKey: PLATFORM_SETTINGS_KEYS.all,
	queryFn: () => platformSettingsService.fetchAll(),
});

export function usePlatformSettings() {
	return useQuery(platformSettingsQueryOptions);
}

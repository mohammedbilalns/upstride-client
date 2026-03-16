import {
	queryOptions,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import type { ApiError } from "@/api/apiError";
import { platformSettingsService } from "../services/platform-settings.service";
import type {
	UpdateContentSettingsInput,
	UpdateEconomySettingsInput,
	UpdateMentorSettingsInput,
	UpdateSessionSettingsInput,
} from "../types";

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

export function usePlatformSettingsMutations() {
	const queryClient = useQueryClient();

	const updateEconomy = useMutation({
		mutationFn: (data: UpdateEconomySettingsInput) =>
			platformSettingsService.updateEconomy(data),
		onSuccess: (response) => {
			toast.success(response.message || "Coin settings updated successfully");
			queryClient.invalidateQueries({ queryKey: PLATFORM_SETTINGS_KEYS.all });
		},
		onError: (error: ApiError) => {
			toast.error(
				error.response?.data?.message || "Failed to update coin settings",
			);
		},
	});

	const updateMentors = useMutation({
		mutationFn: (data: UpdateMentorSettingsInput) =>
			platformSettingsService.updateMentors(data),
		onSuccess: (response) => {
			toast.success(response.message || "Mentor settings updated successfully");
			queryClient.invalidateQueries({ queryKey: PLATFORM_SETTINGS_KEYS.all });
		},
		onError: (error: ApiError) => {
			toast.error(
				error.response?.data?.message || "Failed to update mentor settings",
			);
		},
	});

	const updateContent = useMutation({
		mutationFn: (data: UpdateContentSettingsInput) =>
			platformSettingsService.updateContent(data),
		onSuccess: (response) => {
			toast.success(
				response.message || "Content settings updated successfully",
			);
			queryClient.invalidateQueries({ queryKey: PLATFORM_SETTINGS_KEYS.all });
		},
		onError: (error: ApiError) => {
			toast.error(
				error.response?.data?.message || "Failed to update content settings",
			);
		},
	});

	const updateSessions = useMutation({
		mutationFn: (data: UpdateSessionSettingsInput) =>
			platformSettingsService.updateSessions(data),
		onSuccess: (response) => {
			toast.success(
				response.message || "Session settings updated successfully",
			);
			queryClient.invalidateQueries({ queryKey: PLATFORM_SETTINGS_KEYS.all });
		},
		onError: (error: ApiError) => {
			toast.error(
				error.response?.data?.message || "Failed to update session settings",
			);
		},
	});

	return {
		updateEconomy,
		updateMentors,
		updateContent,
		updateSessions,
	};
}

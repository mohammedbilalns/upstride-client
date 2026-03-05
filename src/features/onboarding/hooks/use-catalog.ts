import { useQuery } from "@tanstack/react-query";
import { onboardingService } from "../services/onboarding.service";

export const USE_ONBOARDING_CATALOG_KEY = ["onboardingCatalog"] as const;

export function useOnboardingCatalog() {
	return useQuery({
		queryKey: USE_ONBOARDING_CATALOG_KEY,
		queryFn: async () => {
			const res = await onboardingService.getOnboardingCatalog();
			return res.data;
		},
		staleTime: Number.POSITIVE_INFINITY,
	});
}

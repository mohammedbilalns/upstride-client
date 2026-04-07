import { useRouter } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setAuthSession } from "@/features/authentication/utils/set-auth-session";
import { profileService } from "../services/profile.service";
import type { UpdateProfileInput } from "../types";

export function useUpdateProfile(options?: {
	onSuccess?: (data: { success: boolean; message: string }) => void;
	onError?: (error: Error) => void;
}) {
	const queryClient = useQueryClient();
	const router = useRouter();

	return useMutation({
		mutationFn: (data: UpdateProfileInput) =>
			profileService.updateProfile(data),
		onSuccess: async (response, variables) => {
			queryClient.invalidateQueries({ queryKey: ["profile"] });
			const authContext = router.options.context?.auth;
			if (
				authContext?.isAuthenticated &&
				authContext.accessToken &&
				authContext.user
			) {
				try {
					const profileResponse = await profileService.getProfile();
					const updatedProfile = profileResponse.profile;
					const shouldBustCache = Boolean(variables.profilePictureId);
					const cacheBustedUrl =
						updatedProfile.profilePictureUrl && shouldBustCache
							? `${updatedProfile.profilePictureUrl}${
									updatedProfile.profilePictureUrl.includes("?") ? "&" : "?"
								}v=${Date.now()}`
							: updatedProfile.profilePictureUrl;

					queryClient.setQueryData(["profile"], updatedProfile);
					setAuthSession(
						router,
						{
							...authContext.user,
							name: updatedProfile.name,
							profilePictureUrl: cacheBustedUrl,
						},
						authContext.accessToken,
						authContext.csrfToken ?? "",
					);
				} catch {
					// If refresh fails, keep current auth context to avoid breaking UI.
				}
			}
			options?.onSuccess?.(response);
		},
		onError: options?.onError,
	});
}

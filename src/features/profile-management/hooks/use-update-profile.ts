import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "../services/profile.service";
import type { UpdateProfileInput } from "../types";

export function useUpdateProfile(options?: {
	onSuccess?: (data: { success: boolean; message: string }) => void;
	onError?: (error: Error) => void;
}) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: UpdateProfileInput) =>
			profileService.updateProfile(data),
		onSuccess: (response) => {
			queryClient.invalidateQueries({ queryKey: ["profile"] });
			options?.onSuccess?.(response);
		},
		onError: options?.onError,
	});
}

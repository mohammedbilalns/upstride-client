import { useMutation } from "@tanstack/react-query";
import { profileService } from "../services/profile.service";

import type { ChangePasswordInput, ChangePasswordOutput } from "../types";

export function useChangePassword(options?: {
	onSuccess?: (response: ChangePasswordOutput) => void;
	onError?: (error: any) => void;
}) {
	return useMutation({
		mutationFn: (data: ChangePasswordInput) =>
			profileService.changePassword(data),
		onSuccess: (response) => {
			options?.onSuccess?.(response);
		},
		onError: options?.onError,
	});
}

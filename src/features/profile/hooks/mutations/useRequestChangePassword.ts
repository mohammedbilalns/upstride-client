import { useMutation } from "@tanstack/react-query";
import type { ApiError } from "@/api/apiError";
import { profileService } from "../../services/profile.service";

export function useRequestChangePassword(options?: {
	onSuccess?: (response: { message: string }) => void;
	onError?: (error: ApiError) => void;
}) {
	return useMutation({
		mutationFn: (data: { oldPassword: string }) =>
			profileService.requestChangePassword(data),
		onSuccess: (response) => {
			options?.onSuccess?.(response);
		},
		onError: options?.onError,
	});
}

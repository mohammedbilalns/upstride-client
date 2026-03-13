import { useMutation } from "@tanstack/react-query";
import { profileService } from "../services/profile.service";

export function useRequestChangePassword(options?: {
	onSuccess?: (response: { message: string }) => void;
	onError?: (error: any) => void;
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

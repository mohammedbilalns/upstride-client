import { useMutation } from "@tanstack/react-query";
import { profileService } from "../services/profile.service";

import type {
	VerifyChangePasswordOtpInput,
	VerifyChangePasswordOtpOutput,
} from "../types";

export function useVerifyChangePasswordOtp(options?: {
	onSuccess?: (response: VerifyChangePasswordOtpOutput) => void;
	onError?: (error: any) => void;
}) {
	return useMutation({
		mutationFn: (data: VerifyChangePasswordOtpInput) =>
			profileService.verifyChangePasswordOtp(data),
		onSuccess: (response) => {
			options?.onSuccess?.(response);
		},
		onError: options?.onError,
	});
}

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { authService } from "@/features/authentication/services/auth.service";
import type { SaveUserInterestsResponse } from "@/features/authentication/types";
import { setAuthSession } from "@/features/authentication/utils/set-auth-session";
import type { SaveInterestsPayload } from "../validators";

type SaveInterestsResponse = {
	message: string;
	data: SaveUserInterestsResponse;
};

interface UseSaveInterestsProps {
	onSuccess?: (response: SaveInterestsResponse) => void;
	onError?: (
		error: Error | { response?: { data?: { message?: string } } },
	) => void;
}

export function useSaveInterests({
	onSuccess,
	onError,
}: UseSaveInterestsProps = {}) {
	const router = useRouter();

	return useMutation({
		mutationFn: (payload: SaveInterestsPayload) =>
			authService.saveInterests(payload),
		onSuccess: (response) => {
			const { user, accessToken, csrfToken } = response.data;
			if (user && accessToken && csrfToken) {
				setAuthSession(router, user, accessToken, csrfToken);
			}
			onSuccess?.(response);
		},
		onError,
	});
}

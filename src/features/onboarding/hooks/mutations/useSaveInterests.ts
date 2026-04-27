import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { authService } from "@/features/auth/services/auth.service";
import type { SaveUserInterestsResponse } from "@/features/auth/types";
import { setAuthSession } from "@/features/auth/utils/setAuthSession";
import type { SaveInterestsPayload } from "../../validators/onboarding.schema";

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
			const payload = response.data;
			const user = payload?.user;
			const accessToken = payload?.accessToken;
			const csrfToken = payload?.csrfToken;
			if (user && accessToken && csrfToken) {
				setAuthSession(router, user, accessToken, csrfToken);
			}
			onSuccess?.(response);
		},
		onError,
	});
}

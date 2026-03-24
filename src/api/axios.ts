import type { InternalAxiosRequestConfig } from "axios";
import axios, { type AxiosError } from "axios";
import { router } from "@/app/router/routerConfig";
import { clearAuthSession } from "@/features/authentication/utils/clear-auth-session";
import { env } from "@/shared/config/env";

/**
 * Axios request config type with retry flag
 */
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
	_retry?: boolean;
}

const api = axios.create({
	baseURL: env.API_URL,
	withCredentials: true,
});

/**
 * Request interceptor:
 * Injects the Access Token from the Router context into the Authorization header.
 */
api.interceptors.request.use((config) => {
	const auth = router.options.context?.auth;
	const token = auth?.accessToken;
	const csrfToken = auth?.csrfToken;

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	if (csrfToken && config.url?.includes("/auth/refresh")) {
		config.headers["x-csrf-token"] = csrfToken;
	}
	return config;
});

/**
 * Response interceptor handles global API errors
 */
api.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const originalRequest = error.config as CustomAxiosRequestConfig;

		// Handle expired token (401 Unauthorized)
		if (error.response?.status === 401 && !originalRequest._retry) {
			// Skip refresh for auth or expertise-related endpoints
			const isAuthEndpoint =
				originalRequest.url?.includes("/auth") &&
				!originalRequest.url.includes("/me") &&
				!originalRequest.url.includes("/active-sessions") &&
				!originalRequest.url.includes("/revoke-session") &&
				!originalRequest.url.includes("/revoke-all-other-sessions");

			if (isAuthEndpoint) {
				clearAuthSession(router);
				return Promise.reject(error);
			}

			originalRequest._retry = true;

			try {
				// Attempt to refresh the access token
				const { data } = await api.post("/auth/refresh");
				const newAccessToken = data.data.accessToken;

				// Update the router context with the new token
				router.update({
					context: {
						...router.options.context,
						auth: {
							...router.options.context.auth,
							accessToken: newAccessToken,
							isAuthenticated: true,
						},
					},
				});

				// Retry the original request with new tokens
				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
				return api(originalRequest);
			} catch (refreshError) {
				// Refresh failed then log out and clear auth state
				clearAuthSession(router);
				router.navigate({ to: "/auth" });
				return Promise.reject(refreshError);
			}
		}

		if (error.response?.status === 403) {
			// Handle forbidden access (403) — blocked users
			const data = error.response.data as { message?: string };
			if (data?.message?.toLowerCase().includes("blocked")) {
				clearAuthSession(router);
				router.navigate({
					to: "/auth",
					search: { error: "blocked" },
				});
				return Promise.reject(error);
			}
		}

		return Promise.reject(error);
	},
);

export default api;

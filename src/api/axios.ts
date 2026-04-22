import type { InternalAxiosRequestConfig } from "axios";
import axios, { type AxiosError } from "axios";
import type { router as AppRouter } from "@/app/router/routerConfig";
import { authService } from "@/features/auth/services/auth.service";
import { clearAuthSession } from "@/features/auth/utils/clearAuthSession";
import { env } from "@/shared/config/env";

/**
 * Axios request config type with retry flags
 */
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
	_retry?: boolean;
	_csrfRetry?: boolean;
}

let routerInstance: typeof AppRouter | null = null;

export const injectRouter = (router: typeof AppRouter) => {
	routerInstance = router;
};

const api = axios.create({
	baseURL: env.API_URL,
	withCredentials: true,
});

/**
 * Request interceptor:
 * Injects the Access Token from the Router context into the Authorization header.
 */
api.interceptors.request.use((config) => {
	const auth = routerInstance?.options.context?.auth;
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

		if (
			error.response?.status === 403 &&
			originalRequest.url?.includes("/auth/refresh") &&
			!originalRequest._csrfRetry
		) {
			const data = error.response.data as { message?: string } | undefined;
			const message = data?.message?.toLowerCase() ?? "";

			if (message.includes("csrf")) {
				originalRequest._csrfRetry = true;

				const csrfResponse = await authService.getCsrfToken();
				const csrfToken = csrfResponse.data.csrfToken;

				routerInstance?.update({
					context: {
						...routerInstance.options.context,
						auth: {
							...routerInstance.options.context.auth,
							csrfToken,
						},
					},
				});

				originalRequest.headers = originalRequest.headers ?? {};
				originalRequest.headers["x-csrf-token"] = csrfToken;
				return api(originalRequest);
			}
		}

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
				if (routerInstance) clearAuthSession(routerInstance);
				return Promise.reject(error);
			}

			originalRequest._retry = true;

			try {
				// Attempt to refresh the access token
				const { data } = await api.post("/auth/refresh");
				const newAccessToken = data.data.accessToken;

				// Update the router context with the new token
				routerInstance?.update({
					context: {
						...routerInstance.options.context,
						auth: {
							...routerInstance.options.context.auth,
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
				if (routerInstance) {
					clearAuthSession(routerInstance);
					routerInstance.navigate({ to: "/auth" });
				}
				return Promise.reject(refreshError);
			}
		}

		if (error.response?.status === 403) {
			// Handle forbidden access (403)
			const data = error.response.data as { message?: string };
			if (data?.message?.toLowerCase().includes("blocked")) {
				if (routerInstance) {
					clearAuthSession(routerInstance);
					routerInstance.navigate({
						to: "/auth",
						search: { error: "blocked" },
					});
				}
				return Promise.reject(error);
			}
		}

		return Promise.reject(error);
	},
);

export default api;

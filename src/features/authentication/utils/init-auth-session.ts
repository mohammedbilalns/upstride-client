import type { router } from "@/app/router/routerConfig";
import { authService } from "@/features/authentication/services/auth.service";

type AppRouter = typeof router;

/**
 * Initializes auth state by refreshing token and hydrating the current user
 * into the TanStack Router context.
 */
export async function initAuthSession(appRouter: AppRouter): Promise<void> {
	try {
		const refreshResponse = await authService.refreshToken();
		const token = refreshResponse.data.accessToken;

		appRouter.update({
			context: {
				...appRouter.options.context,
				auth: {
					user: null,
					isAuthenticated: true,
					accessToken: token,
				},
			},
		});

		const meResponse = await authService.getMe();
		const userData = meResponse.data.user;

		appRouter.update({
			context: {
				...appRouter.options.context,
				auth: {
					user: userData,
					isAuthenticated: true,
					accessToken: token,
				},
			},
		});
	} catch (error) {
		console.error("Failed to initialize auth session:", error);
		appRouter.update({
			context: {
				...appRouter.options.context,
				auth: {
					user: null,
					isAuthenticated: false,
					accessToken: null,
				},
			},
		});
	}
}

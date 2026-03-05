import type { router } from "@/app/router/routerConfig";
import type { AuthenticatedUser } from "../types";

type AppRouter = typeof router;

/**
 * Writes the authenticated user and access token into the TanStack Router
 */
export function setAuthSession(
	appRouter: AppRouter,
	user: AuthenticatedUser,
	accessToken: string,
): void {
	if (appRouter.options.context) {
		appRouter.options.context.auth = {
			isAuthenticated: true,
			user,
			accessToken,
		};
	}
}

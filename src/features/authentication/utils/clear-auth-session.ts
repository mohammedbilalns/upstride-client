import type { router } from "@/app/router/routerConfig";
import { PushNotificationService } from "@/shared/services/push-notification.service";

type AppRouter = typeof router;

/**
 * Clears the authenticated user and access token from the  Router context
 */
export function clearAuthSession(appRouter: AppRouter): void {
	if (appRouter.options.context) {
		PushNotificationService.unsubscribeUser().catch(console.error);

		appRouter.update({
			context: {
				...appRouter.options.context,
				auth: {
					isAuthenticated: false,
					user: null,
					accessToken: null,
					csrfToken: null,
				},
			},
		});
	}
}

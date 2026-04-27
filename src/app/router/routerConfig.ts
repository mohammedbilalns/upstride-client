import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { injectRouter } from "@/api/axios";
import PendingComponent from "@/components/common/PendingComponent";
import type { AuthenticatedUser } from "@/features/auth/types";
import { routeTree } from "@/routeTree.gen";

export const queryClient = new QueryClient();

/**
 * Context interface for the router.
 */
export interface RouterContext {
	queryClient: QueryClient;
	auth: {
		user: AuthenticatedUser | null;
		isAuthenticated: boolean;
		accessToken: string | null;
		csrfToken: string | null;
	};
}

export const router = createRouter({
	routeTree,
	context: {
		queryClient,
		auth: {
			user: null,
			isAuthenticated: false,
			accessToken: null,
			csrfToken: null,
		},
	} as RouterContext,
	defaultPreload: "intent",
	defaultPendingComponent: PendingComponent,
	scrollRestoration: true,
});

injectRouter(router);

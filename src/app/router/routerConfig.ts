import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import PendingComponent from "@/components/common/Pending-Component";
import type { AuthenticatedUser } from "@/features/authentication/types";
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
		},
	} as RouterContext,
	defaultPreload: "intent",
	defaultPendingComponent: PendingComponent,
	scrollRestoration: true,
});

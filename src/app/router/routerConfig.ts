import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import PendingComponent from "@/components/common/Pending-Component";
import type { RouterContext } from "@/routes/__root";
import { routeTree } from "@/routeTree.gen";

export const queryClient = new QueryClient();
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
	defaultPendingMs: 0,
	defaultPendingMinMs: 100,
	scrollRestoration: true,
});

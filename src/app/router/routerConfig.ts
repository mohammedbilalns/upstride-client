import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";

const queryClient = new QueryClient();
export const router = createRouter({
	routeTree,
	context: {
		queryClient,
		auth: {
			user: null,
			isAuthenticated: false,
			accessToken: null,
		},
	},
	defaultPreload: "intent",
	scrollRestoration: true,
});

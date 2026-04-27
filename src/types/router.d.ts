import type { router } from "@/app/router/routerConfig";

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

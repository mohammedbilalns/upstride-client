import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { SocketProvider } from "@/app/contexts/SocketContext";
import type { RouterContext } from "@/app/router/routerConfig";
import ErrorComponent from "@/components/common/ErrorComponent";
import NotFoundComponent from "@/components/common/NotFound";
import "../styles.css";

/**
 * Root route configuration.
 */
export const Route = createRootRouteWithContext<RouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Upstride",
			},
		],
	}),
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent,
});

/**
 * Root component that wraps all route content.
 */
function RootComponent() {
	return (
		<SocketProvider>
			<Outlet />
		</SocketProvider>
	);
}

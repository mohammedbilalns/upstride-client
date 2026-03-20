import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import type { RouterContext } from "@/app/router/routerConfig";
import ErrorComponent from "@/components/common/Error-Component";
import NotFoundComponent from "@/components/common/Not-Found";
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
		<>
			<Outlet />
			<TanStackDevtools
				config={{
					position: "bottom-right",
					openHotkey: ["control", "shift", "d"],
				}}
				plugins={[
					{
						name: "TanStack Router",
						render: <TanStackRouterDevtoolsPanel />,
					},
				]}
			/>
		</>
	);
}

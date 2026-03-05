import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import "../styles.css";
import ErrorComponent from "@/components/common/Error-Component";
import NotFoundComponent from "@/components/common/Not-Found";

import type { AuthenticatedUser } from "@/features/authentication/types";

export interface RouterContext {
	queryClient: QueryClient;
	auth: {
		user: AuthenticatedUser | null;
		isAuthenticated: boolean;
		accessToken: string | null;
	};
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent,
});

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

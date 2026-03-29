import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_user-layout/mentor")({
	beforeLoad: async ({ context }) => {
		if (context.auth.user?.role !== "MENTOR") {
			throw redirect({
				to: "/home",
			});
		}
	},
	component: () => <Outlet />,
});

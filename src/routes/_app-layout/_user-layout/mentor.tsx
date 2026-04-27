import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app-layout/_user-layout/mentor")({
	beforeLoad: async ({ context, location }) => {
		const role = context.auth.user?.role;
		const isRegisterRoute = location.pathname.startsWith("/mentor/register");

		if (isRegisterRoute) {
			if (role !== "USER") {
				throw redirect({
					to: "/home",
				});
			}
			return;
		}

		if (role !== "MENTOR") {
			throw redirect({
				to: "/home",
			});
		}
	},
	component: () => <Outlet />,
});

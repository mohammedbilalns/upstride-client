import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

/**
 * User layout route that wraps pages for authenticated non-admin users.
 */
export const Route = createFileRoute("/_app-layout/_user-layout")({
	beforeLoad: async ({ context }) => {
		if (
			context.auth.user?.role === "ADMIN" ||
			context.auth.user?.role === "SUPER_ADMIN"
		) {
			throw redirect({
				to: "/dashboard",
			});
		}
	},
	component: UserLayout,
});

function UserLayout() {
	return <Outlet />;
}

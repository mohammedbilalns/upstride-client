import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

/**
 * Public layout route that wraps pages accessible to unauthenticated users.
 */
export const Route = createFileRoute("/_public-layout")({
	beforeLoad: async ({ context }) => {
		// If user is already authenticated, redirect based on role
		if (context.auth.isAuthenticated) {
			const role = context.auth.user?.role;

			if (role === "ADMIN" || role === "SUPER_ADMIN") {
				throw redirect({
					to: "/dashboard",
				});
			}

			throw redirect({
				to: "/home",
			});
		}
	},
	component: PublicLayout,
});

function PublicLayout() {
	return <Outlet />;
}

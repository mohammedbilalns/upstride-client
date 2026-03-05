import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_public-layout")({
	beforeLoad: async ({ context }) => {
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

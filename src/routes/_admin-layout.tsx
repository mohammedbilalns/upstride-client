import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin-layout")({
	beforeLoad: async ({ context, location }) => {
		if (!context.auth.isAuthenticated) {
			throw redirect({
				to: "/auth",
				search: { redirect: location.href },
			});
		}

		if (
			context.auth.user?.role !== "admin" &&
			context.auth.user?.role !== "superadmin"
		) {
			throw redirect({
				to: "/home",
			});
		}
	},
	component: AdminLayout,
});

function AdminLayout() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<Outlet />
		</div>
	);
}

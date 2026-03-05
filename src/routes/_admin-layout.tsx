import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import AdminSidebar from "@/components/common/AdminSidebar";

export const Route = createFileRoute("/_admin-layout")({
	beforeLoad: async ({ context, location }) => {
		if (!context.auth.isAuthenticated) {
			throw redirect({
				to: "/auth",
				search: { redirect: location.href },
			});
		}

		if (
			context.auth.user?.role !== "ADMIN" &&
			context.auth.user?.role !== "SUPER_ADMIN"
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
		<div className="min-h-screen bg-background text-foreground flex">
			<AdminSidebar />
			<main className="flex-1 overflow-y-auto">
				<Outlet />
			</main>
		</div>
	);
}

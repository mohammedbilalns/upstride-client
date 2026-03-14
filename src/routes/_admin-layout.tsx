import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import AdminSidebar from "@/components/common/AdminSidebar";

/**
 * Admin layout route that does authentication and authorization checks before rendering child routes.
 */
export const Route = createFileRoute("/_admin-layout")({
	beforeLoad: async ({ context, location }) => {
		// Check if user is authenticated - redirect to auth if not
		if (!context.auth.isAuthenticated) {
			throw redirect({
				to: "/auth",
				search: { redirect: location.href },
			});
		}

		// Check if user has admin role - redirect to home if not
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
			{/* Navigation sidebar for admin pages */}
			<AdminSidebar />
			<main className="flex-1 overflow-y-auto">
				<Outlet />
			</main>
		</div>
	);
}

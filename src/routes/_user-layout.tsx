import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import UserNavbar from "@/components/common/Navbar";

/**
 * User layout route that wraps pages for authenticated non-admin users.
 */
export const Route = createFileRoute("/_user-layout")({
	beforeLoad: async ({ context, location }) => {
		// Check if user is authenticated - redirect to auth if not
		if (!context.auth.isAuthenticated) {
			throw redirect({
				to: "/auth",
				search: { redirect: location.href },
			});
		}

		// Prevent admins from accessing user-only routes - redirect to dashboard
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
	return (
		<div className="min-h-screen bg-background text-foreground flex flex-col">
			{/*  Top navigation bar for user pages */}
			<UserNavbar />
			<main className="flex-1 pt-20">
				<Outlet />
			</main>
		</div>
	);
}

import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { GlobalSuccessHandler } from "@/components/common/GlobalSuccessHandler";
import UserNavbar from "@/components/common/Navbar";

/**
 * Shared layout for authenticated user and mentor routes.
 */
export const Route = createFileRoute("/_app-layout")({
	beforeLoad: async ({ context, location }) => {
		if (!context.auth.isAuthenticated) {
			throw redirect({
				to: "/auth",
				search: { redirect: location.href },
			});
		}
	},
	component: AppLayout,
});

function AppLayout() {
	return (
		<>
			<UserNavbar />
			<GlobalSuccessHandler />
			<main className="flex-1 pt-20">
				<Outlet />
			</main>
		</>
	);
}

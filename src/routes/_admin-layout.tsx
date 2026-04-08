import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { useState } from "react";
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
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	return (
		<div className="min-h-screen bg-background text-foreground flex">
			{/* Navigation sidebar for admin pages */}
			<AdminSidebar
				isOpen={isSidebarOpen}
				onClose={() => setIsSidebarOpen(false)}
			/>
			{isSidebarOpen && (
				<button
					type="button"
					className="fixed inset-0 bg-black/40 z-40 lg:hidden"
					aria-label="Close sidebar overlay"
					onClick={() => setIsSidebarOpen(false)}
				/>
			)}
			<button
				type="button"
				className="fixed bottom-4 left-4 z-40 lg:hidden rounded-full bg-primary text-primary-foreground p-3 shadow-lg"
				onClick={() => setIsSidebarOpen(true)}
				aria-label="Open sidebar"
			>
				<Menu className="h-5 w-5" />
			</button>
			<main className="flex-1 overflow-y-auto lg:ml-[calc(18rem+0.75rem)]">
				<Outlet />
			</main>
		</div>
	);
}

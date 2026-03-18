import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import MentorSidebar from "@/components/common/MentorSidebar";

export const Route = createFileRoute("/_mentor-layout")({
	beforeLoad: async ({ context, location }) => {
		if (!context.auth.isAuthenticated) {
			throw redirect({
				to: "/auth",
				search: { redirect: location.href },
			});
		}

		if (context.auth.user?.role !== "MENTOR") {
			throw redirect({
				to: "/home",
			});
		}
	},
	component: MentorLayout,
});

function MentorLayout() {
	return (
		<div className="min-h-screen bg-background text-foreground flex">
			<MentorSidebar />
			<main className="flex-1 overflow-y-auto">
				<Outlet />
			</main>
		</div>
	);
}

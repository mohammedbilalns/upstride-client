import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboardPage } from "@/features/admin-dashboard/pages/AdminDashboardPage";

export const Route = createFileRoute("/_admin-layout/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	return <AdminDashboardPage />;
}

import { createLazyFileRoute } from "@tanstack/react-router";
import { AdminDashboardPage } from "@/features/admin-dashboard/pages/AdminDashboardPage";

export const Route = createLazyFileRoute("/_admin-layout/dashboard")({
	component: AdminDashboardPage,
});

import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import {
	DashboardPage,
	dashboardActivityOverviewQueryOptions,
	dashboardQueryOptions,
} from "@/features/dashboard";
import { DashboardSkeleton } from "@/features/dashboard/components/DashboardSkeleton";

export const Route = createFileRoute("/_app-layout/_user-layout/home")({
	loader: async ({ context: { auth, queryClient } }) => {
		const role = auth.user?.role === "MENTOR" ? "MENTOR" : "USER";

		await Promise.all([
			queryClient.ensureQueryData(dashboardQueryOptions(role)),
			queryClient.ensureQueryData(
				dashboardActivityOverviewQueryOptions(role, "month"),
			),
		]);
	},
	component: RouteComponent,
	pendingComponent: DashboardSkeleton,
});

function RouteComponent() {
	const { auth } = useRouteContext({ from: "/_app-layout/_user-layout/home" });
	const role = auth.user?.role === "MENTOR" ? "MENTOR" : "USER";

	return (
		<DashboardPage
			displayName={auth.user?.name ?? "there"}
			dashboardRole={role}
		/>
	);
}

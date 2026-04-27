import { createFileRoute, useRouteContext } from "@tanstack/react-router";
import {
	DashboardPage,
	dashboardActivityOverviewQueryOptions,
	dashboardQueryOptions,
} from "@/features/dashboard";

export const Route = createFileRoute(
	"/_app-layout/_mentor-layout/mentor-dashboard",
)({
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
});

function RouteComponent() {
	const { auth } = useRouteContext({
		from: "/_app-layout/_mentor-layout/mentor-dashboard",
	});

	return (
		<DashboardPage
			displayName={auth.user?.name ?? "there"}
			dashboardRole="MENTOR"
		/>
	);
}

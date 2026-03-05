import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin-layout/mentor-management")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_admin-layout/mentor-management"!</div>;
}

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin-layout/user-management")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_admin-layout/user-management"!</div>;
}

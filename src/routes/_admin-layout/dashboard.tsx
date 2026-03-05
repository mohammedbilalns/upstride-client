import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin-layout/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_admin-layout/dashboard"!</div>;
}

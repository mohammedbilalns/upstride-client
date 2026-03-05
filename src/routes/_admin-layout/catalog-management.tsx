import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_admin-layout/catalog-management")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_admin-layout/catalog-management"!</div>;
}

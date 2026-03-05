import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_user-layout/home")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_authenticated/home"!</div>;
}

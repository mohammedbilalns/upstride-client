import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app-layout/call/test")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_app-layout/call/test"!</div>;
}

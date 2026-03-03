import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(authenticated)/home")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/(authenticated)/home"!</div>;
}

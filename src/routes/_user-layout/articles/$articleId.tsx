import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_user-layout/articles/$articleId")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/_user-layout/articles/$articleId"!</div>;
}

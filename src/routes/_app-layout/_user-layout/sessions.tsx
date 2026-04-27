import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app-layout/_user-layout/sessions")({
	component: SessionsLayout,
});

function SessionsLayout() {
	return <Outlet />;
}

import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_user-layout/profile")({
	component: ProfileLayout,
});

function ProfileLayout() {
	return <Outlet />;
}

import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_user-layout/mentors")({
	component: MentorsLayout,
});

function MentorsLayout() {
	return <Outlet />;
}

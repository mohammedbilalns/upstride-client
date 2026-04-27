import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app-layout/_user-layout/mentors")({
	component: MentorsLayout,
});

function MentorsLayout() {
	return <Outlet />;
}

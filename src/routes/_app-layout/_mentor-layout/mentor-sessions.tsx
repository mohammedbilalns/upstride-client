import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_app-layout/_mentor-layout/mentor-sessions",
)({
	component: MentorSessionsLayout,
});

function MentorSessionsLayout() {
	return <Outlet />;
}

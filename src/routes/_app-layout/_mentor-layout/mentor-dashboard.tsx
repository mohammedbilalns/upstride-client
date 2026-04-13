import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute(
	"/_app-layout/_mentor-layout/mentor-dashboard",
)({
	beforeLoad: () => {
		throw redirect({ to: "/profile" });
	},
});

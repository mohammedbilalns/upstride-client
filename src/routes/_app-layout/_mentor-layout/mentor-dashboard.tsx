import { createFileRoute } from "@tanstack/react-router";
import { MentorDashboardPage } from "@/features/mentor-dashboard/pages/MentorDashboardPage";
export const Route = createFileRoute(
	"/_app-layout/_mentor-layout/mentor-dashboard",
)({
	component: MentorDashboardPage,
});

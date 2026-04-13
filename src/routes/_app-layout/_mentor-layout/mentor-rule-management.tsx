import { createFileRoute } from "@tanstack/react-router";
import { MentorRuleManagementPage } from "@/features/availability-management/pages/MentorRuleManagementPage";

export const Route = createFileRoute(
	"/_app-layout/_mentor-layout/mentor-rule-management",
)({
	component: MentorRuleManagementPage,
});

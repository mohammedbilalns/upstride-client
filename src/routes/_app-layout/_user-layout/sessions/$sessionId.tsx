import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_app-layout/_user-layout/sessions/$sessionId",
)({
	component: () => null,
});

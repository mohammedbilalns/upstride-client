import { createFileRoute } from "@tanstack/react-router";
import AuthPage from "@/features/authentication/pages/AuthPage";

export const Route = createFileRoute("/auth")({
	component: AuthPage,
});

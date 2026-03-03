import { createFileRoute } from "@tanstack/react-router";
import AuthPage from "@/features/authentication/pages/AuthPage";

export const Route = createFileRoute("/auth")({
	validateSearch: (search: Record<string, unknown>): { redirect?: string } => {
		return {
			redirect: search.redirect as string | undefined,
		};
	},
	component: AuthPage,
});

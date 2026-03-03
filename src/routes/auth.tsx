import { createFileRoute } from "@tanstack/react-router";
import AuthPage from "@/features/authentication/pages/AuthPage";

export const Route = createFileRoute("/auth")({
	validateSearch: (
		search: Record<string, unknown>,
	): { redirect?: string; error?: string } => {
		return {
			redirect: search.redirect as string | undefined,
			error: search.error as string | undefined,
		};
	},
	component: AuthPage,
});

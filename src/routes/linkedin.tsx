import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/linkedin")({
	validateSearch: (
		search: Record<string, unknown>,
	): {
		code?: string;
		state?: string;
		error?: string;
		error_description?: string;
	} => ({
		code: search.code as string | undefined,
		state: search.state as string | undefined,
		error: search.error as string | undefined,
		error_description: search.error_description as string | undefined,
	}),
	component: LinkedInCallbackWrapper,
});

function LinkedInCallbackWrapper() {
	const search = Route.useSearch();

	useEffect(() => {
		if (window.opener) {
			window.opener.postMessage(
				{
					from: "linkedin-oauth",
					code: search.code,
					state: search.state,
					error: search.error,
					errorMessage: search.error_description,
				},
				window.location.origin,
			);

			window.close();
			return;
		}
	}, [search.code, search.error, search.error_description, search.state]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-background text-foreground">
			<div className="flex flex-col items-center gap-3 text-center">
				<Loader2 className="h-6 w-6 animate-spin text-primary" />
				<div>
					<p className="font-medium">Completing LinkedIn sign-in</p>
					<p className="text-sm text-muted-foreground">
						You can close this window if it does not close automatically.
					</p>
				</div>
			</div>
		</div>
	);
}

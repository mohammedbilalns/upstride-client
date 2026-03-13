import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/linkedin")({
	component: LinkedInCallbackWrapper,
});

function LinkedInCallbackWrapper() {
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const code = params.get("code");
		const state = params.get("state");
		const error = params.get("error");
		const errorDescription = params.get("error_description");

		if (window.opener) {
			window.opener.postMessage(
				{
					from: "linkedin-oauth",
					code: code ?? undefined,
					state: state ?? undefined,
					error: error ?? undefined,
					errorMessage: errorDescription ?? undefined,
				},
				window.location.origin,
			);

			window.close();
			return;
		}
	}, []);

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

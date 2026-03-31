import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute(
	"/_app-layout/_user-layout/sessions/$sessionId",
)({
	component: SessionDetailsPage,
});

function SessionDetailsPage() {
	const { sessionId } = Route.useParams();

	return (
		<div className="container mx-auto px-4 md:px-6 py-8 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
						Session Details
					</h1>
					<p className="text-sm text-muted-foreground">
						Review the details for this session.
					</p>
				</div>
				<Button asChild variant="ghost" size="sm">
					<Link to="/sessions" className="flex items-center gap-2">
						<ArrowLeft className="h-4 w-4" />
						Back to sessions
					</Link>
				</Button>
			</div>

			<div className="rounded-2xl border border-zinc-200/70 bg-white/70 backdrop-blur-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950/40 p-5">
				<p className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
					Session ID
				</p>
				<p className="mt-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
					{sessionId}
				</p>
			</div>
		</div>
	);
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_user-layout/chat/$mentorId")({
	component: ChatPlaceholder,
});

function ChatPlaceholder() {
	const { mentorId } = Route.useParams();

	return (
		<div className="px-6 py-10 space-y-4">
			<h1 className="text-2xl font-semibold">Chat</h1>
			<p className="text-sm text-muted-foreground">
				Chat is not available yet. We will surface conversations here soon.
			</p>
			<Button asChild>
				<Link to="/mentors/$mentorId" params={{ mentorId }}>
					Back to profile
				</Link>
			</Button>
		</div>
	);
}

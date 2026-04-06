import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function ChatNotFound() {
	return (
		<div className="flex flex-1 flex-col items-center justify-center p-8 text-center gap-4">
			<p className="text-sm text-muted-foreground">Conversation not found.</p>
			<Button asChild variant="outline">
				<Link to="/chats">Back to chats</Link>
			</Button>
		</div>
	);
}

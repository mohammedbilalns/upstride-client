import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { articleService } from "../services/article.service";
import { MessageSquareText } from "lucide-react";

interface AppealDialogProps {
	articleId: string;
	onSuccess?: () => void;
}

export function AppealDialog({ articleId, onSuccess }: AppealDialogProps) {
	const [message, setMessage] = useState("");
	const [isOpen, setIsOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async () => {
		if (message.trim().length < 10) {
			toast.error("Appeal message must be at least 10 characters long");
			return;
		}

		try {
			setIsSubmitting(true);
			await articleService.submitAppeal({ articleId, message });
			toast.success("Appeal submitted successfully");
			setIsOpen(false);
			onSuccess?.();
		} catch (error) {
			toast.error("Failed to submit appeal");
			console.error(error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					className="mt-4 bg-white text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
				>
					<MessageSquareText className="h-4 w-4 mr-2" />
					Submit an Appeal
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Submit Article Appeal</DialogTitle>
					<DialogDescription>
						Describe why you believe this article should be unblocked. Mention
						any changes you've made to addrress the blocking reason.
					</DialogDescription>
				</DialogHeader>
				<div className="py-4">
					<Textarea
						placeholder="Explain your appeal here..."
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						className="min-h-[150px]"
					/>
					<p className="text-xs text-muted-foreground mt-2">
						Min 10 characters. Max 1000 characters.
					</p>
				</div>
				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => setIsOpen(false)}
						disabled={isSubmitting}
					>
						Cancel
					</Button>
					<Button onClick={handleSubmit} disabled={isSubmitting}>
						{isSubmitting ? "Submitting..." : "Submit Appeal"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

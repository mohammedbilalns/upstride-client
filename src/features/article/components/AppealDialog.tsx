import { useForm } from "@tanstack/react-form";
import { MessageSquareText } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import FieldError from "@/components/common/Field-Error";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { articleService } from "../services/article.service";
import { appealSchema } from "../validators/appeal.schema";

interface AppealDialogProps {
	articleId: string;
	onSuccess?: () => void;
}

export function AppealDialog({ articleId, onSuccess }: AppealDialogProps) {
	const [isOpen, setIsOpen] = useState(false);

	const form = useForm({
		defaultValues: {
			message: "",
		},
		onSubmit: async ({ value }) => {
			try {
				await articleService.submitAppeal({
					articleId,
					message: value.message.trim(),
				});
				toast.success("Appeal submitted successfully");
				setIsOpen(false);
				form.reset();
				onSuccess?.();
			} catch (error) {
				toast.error("Failed to submit appeal");
				console.error(error);
			}
		},
		validators: {
			onSubmit: appealSchema,
		},
	});

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen) {
			form.reset();
		}
		setIsOpen(nextOpen);
	};

	const handleCancel = () => {
		setIsOpen(false);
		form.reset();
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					className="mt-4 bg-white text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
				>
					<MessageSquareText className="h-4 w-4 mr-2" />
					Submit an Appeal
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-125">
				<DialogHeader>
					<DialogTitle>Submit Article Appeal</DialogTitle>
					<DialogDescription>
						Describe why you believe this article should be unblocked. Mention
						any changes you've made to address the blocking reason.
					</DialogDescription>
				</DialogHeader>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<form.Field name="message">
						{(field) => (
							<div className="py-4">
								<Textarea
									id={field.name}
									placeholder="Explain your appeal here..."
									value={field.state.value}
									maxLength={1000}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									className="min-h-37.5"
								/>
								<FieldError
									message={field.state.meta.errors?.[0]?.message as string}
								/>
								<p className="text-xs text-muted-foreground mt-2">
									Min 10 characters. Max 1000 characters.
								</p>
							</div>
						)}
					</form.Field>
					<DialogFooter>
						<form.Subscribe selector={(s) => s.isSubmitting}>
							{(isSubmitting) => (
								<>
									<Button
										type="button"
										variant="outline"
										onClick={handleCancel}
										disabled={isSubmitting}
									>
										Cancel
									</Button>
									<Button type="submit" disabled={isSubmitting}>
										{isSubmitting ? "Submitting..." : "Submit Appeal"}
									</Button>
								</>
							)}
						</form.Subscribe>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

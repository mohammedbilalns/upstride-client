import { useForm } from "@tanstack/react-form";
import { Loader2, Send } from "lucide-react";
import FieldError from "@/components/common/Field-Error";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { commentSchema } from "@/features/article/validators/comment.schema";
import { useProfile } from "@/features/profile-management/hooks/use-profile";
import { useArticleMutations } from "../hooks/mutations";

interface CommentFormProps {
	articleId: string;
	commentId?: string;
	initialContent?: string;
	parentId?: string | null;
	onSuccess?: () => void;
	onCancel?: () => void;
}

export function CommentForm({
	articleId,
	commentId,
	initialContent = "",
	parentId,
	onSuccess,
	onCancel,
}: CommentFormProps) {
	const { createComment, updateComment } = useArticleMutations();
	const { data: profile } = useProfile();
	const isEdit = !!commentId;

	const form = useForm({
		defaultValues: {
			content: initialContent,
		},
		onSubmit: async ({ value }) => {
			if (isEdit) {
				await updateComment.mutateAsync({
					articleId,
					commentId,
					parentId,
					content: value.content,
				});
			} else {
				await createComment.mutateAsync({
					articleId,
					content: value.content,
					parentId,
					userId: profile?.id,
					author: profile
						? {
								name: profile.name,
								avatarUrl: profile.profilePictureUrl || undefined,
							}
						: undefined,
				});
			}
			form.reset();
			onSuccess?.();
		},
		validators: {
			onChange: commentSchema,
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="space-y-4"
		>
			<form.Field name="content">
				{(field) => (
					<div className="space-y-2">
						<Textarea
							id={field.name}
							placeholder="Write a comment..."
							className="min-h-25 resize-none focus:ring-primary shadow-sm rounded-xl p-4"
							value={field.state.value}
							maxLength={500}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
						/>
						<FieldError
							message={field.state.meta.errors?.[0]?.message as string}
						/>
					</div>
				)}
			</form.Field>

			<div className="flex justify-end gap-3">
				{onCancel && (
					<Button
						type="button"
						variant="ghost"
						onClick={onCancel}
						className="rounded-full px-6"
					>
						Cancel
					</Button>
				)}
				<form.Subscribe selector={(s) => s.isSubmitting}>
					{(isSubmitting) => (
						<Button
							type="submit"
							disabled={
								isSubmitting ||
								createComment.isPending ||
								updateComment.isPending
							}
							className="rounded-full px-6"
						>
							{isSubmitting ||
							createComment.isPending ||
							updateComment.isPending ? (
								<Loader2 className="h-4 w-4 animate-spin mr-2" />
							) : (
								<Send className="h-4 w-4 mr-2" />
							)}
							{isEdit ? "Update Comment" : "Post Comment"}
						</Button>
					)}
				</form.Subscribe>
			</div>
		</form>
	);
}

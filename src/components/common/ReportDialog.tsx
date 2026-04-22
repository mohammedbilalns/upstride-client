import { useForm } from "@tanstack/react-form";
import { Flag, Loader2 } from "lucide-react";
import { useState } from "react";
import FieldError from "@/components/common/FieldError";
import { Button } from "@/components/ui/Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/Dialog";
import { Label } from "@/components/ui/Label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useArticleMutations } from "@/features/article/hooks/mutations";
import { reportFormSchema } from "@/features/report/validators/report-form.schema";

interface ReportDialogProps {
	targetId: string;
	targetType: "ARTICLE" | "USER";
	trigger?: React.ReactNode;
}

const REASONS = [
	"Spam",
	"Inappropriate Content",
	"Harassment",
	"Hate Speech",
	"Misinformation",
	"Other",
];

export function ReportDialog({
	targetId,
	targetType,
	trigger,
}: ReportDialogProps) {
	const [open, setOpen] = useState(false);
	const [submitted, setSubmitted] = useState(false);
	const { report } = useArticleMutations();

	const form = useForm({
		defaultValues: {
			reason: "",
			description: "",
		},
		onSubmit: async ({ value }) => {
			await report.mutateAsync({
				targetId,
				targetType,
				reason: value.reason,
				description: value.description,
			});
			setOpen(false);
			setSubmitted(true);
			form.reset();
		},
		validators: {
			onSubmit: reportFormSchema,
		},
	});

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen) {
			form.reset();
		}
		setOpen(nextOpen);
	};

	return submitted ? (
		<Button
			variant="ghost"
			size="sm"
			className="text-muted-foreground cursor-not-allowed gap-2"
			disabled
		>
			<Flag className="h-4 w-4" />
			Report Submitted
		</Button>
	) : (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				{trigger || (
					<Button
						variant="ghost"
						size="sm"
						className="text-zinc-500 hover:text-red-500 gap-2"
					>
						<Flag className="h-4 w-4" />
						Report
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-106.25">
				<DialogHeader>
					<DialogTitle>
						Report {targetType === "ARTICLE" ? "Article" : "User"}
					</DialogTitle>
					<DialogDescription>
						Help us understand what's wrong. Your report will be reviewed by our
						team.
					</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="space-y-4 py-4"
				>
					<form.Field name="reason">
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Reason</Label>
								<Select
									value={field.state.value}
									onValueChange={field.handleChange}
								>
									<SelectTrigger id={field.name}>
										<SelectValue placeholder="Select a reason" />
									</SelectTrigger>
									<SelectContent>
										{REASONS.map((r) => (
											<SelectItem key={r} value={r}>
												{r}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FieldError
									message={field.state.meta.errors?.[0]?.message as string}
								/>
							</div>
						)}
					</form.Field>

					<form.Field name="description">
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Description</Label>
								<Textarea
									id={field.name}
									placeholder="Provide more details..."
									className="resize-none h-24"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
								/>
								<FieldError
									message={field.state.meta.errors?.[0]?.message as string}
								/>
							</div>
						)}
					</form.Field>

					<DialogFooter>
						<form.Subscribe selector={(s) => s.isSubmitting}>
							{(isSubmitting) => (
								<Button
									type="submit"
									variant="destructive"
									disabled={isSubmitting || report.isPending}
								>
									{(isSubmitting || report.isPending) && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									Submit Report
								</Button>
							)}
						</form.Subscribe>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { getErrorMessage } from "@/shared/utils/formValidation";
import FieldError from "./FieldError";

interface AddItemDialogProps {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: (name: string) => Promise<void>;
	title: string;
	description: string;
	label: string;
	placeholder: string;
	isLoading?: boolean;
	confirmText: string;
	schema?: z.ZodType<string>;
}

export function AddItemDialog({
	isOpen,
	onOpenChange,
	onConfirm,
	title,
	description,
	label,
	placeholder,
	isLoading = false,
	confirmText,
	schema,
}: AddItemDialogProps) {
	const validationSchema = schema ? z.object({ name: schema }) : undefined;
	//FIX : pass zod validator to the tanstack form to validate
	const form = useForm<{ name: string }>({
		defaultValues: {
			name: "",
		},
		...(validationSchema
			? {
					validators: {
						onSubmit: validationSchema,
					},
				}
			: {}),
		onSubmit: async ({ value }) => {
			if (schema) {
				const res = schema.safeParse(value.name);
				if (!res.success) return;
			}
			await onConfirm(value.name);
			onOpenChange(false);
		},
	});

	useEffect(() => {
		if (!isOpen) {
			form.reset();
		}
	}, [isOpen, form]);

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
				>
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
						<DialogDescription>{description}</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<form.Field name="name">
							{(field) => (
								<div className="space-y-2">
									<Label htmlFor={field.name}>{label}</Label>
									<Input
										id={field.name}
										placeholder={placeholder}
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												form.handleSubmit();
											}
										}}
									/>
									<FieldError
										message={getErrorMessage(field.state.meta.errors?.[0])}
									/>
								</div>
							)}
						</form.Field>
					</div>
					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<form.Subscribe selector={(s) => [s.isSubmitting]}>
							{([isSubmitting]) => (
								<Button type="submit" disabled={isSubmitting || isLoading}>
									{(isSubmitting || isLoading) && (
										<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									)}
									{confirmText}
								</Button>
							)}
						</form.Subscribe>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

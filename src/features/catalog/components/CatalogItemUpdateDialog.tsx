import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import FieldError from "@/components/common/FieldError";
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
import { catalogUpdateSchema } from "../validators/catalog.schema";

type CatalogItemUpdateDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description: string;
	label?: string;
	placeholder?: string;
	confirmText?: string;
	initialName: string;
	isLoading?: boolean;
	onSubmit: (name: string) => Promise<void>;
};

export function CatalogItemUpdateDialog({
	open,
	onOpenChange,
	title,
	description,
	label = "Name",
	placeholder = "Enter name",
	confirmText = "Save Changes",
	initialName,
	isLoading = false,
	onSubmit,
}: CatalogItemUpdateDialogProps) {
	const form = useForm({
		defaultValues: {
			name: initialName,
		},
		validators: {
			onSubmit: catalogUpdateSchema,
		},
		onSubmit: async ({ value }) => {
			await onSubmit(value.name.trim());
			onOpenChange(false);
		},
	});

	useEffect(() => {
		if (open) {
			form.setFieldValue("name", initialName);
		} else {
			form.reset();
		}
	}, [form, initialName, open]);

	return (
		<Dialog
			open={open}
			onOpenChange={(nextOpen) => {
				onOpenChange(nextOpen);
				if (!nextOpen) {
					form.reset();
				}
			}}
		>
			<DialogContent className="sm:max-w-120">
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
										value={field.state.value}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder={placeholder}
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
						<form.Subscribe selector={(state) => [state.isSubmitting]}>
							{([isSubmitting]) => (
								<Button type="submit" disabled={isSubmitting || isLoading}>
									{(isSubmitting || isLoading) && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

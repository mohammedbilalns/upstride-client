import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import FieldError from "@/components/common/Field-Error";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateAdmin } from "../hooks/use-admin-actions";
import { createAdminSchema } from "../validators/create-admin.schema";

interface CreateAdminDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function CreateAdminDialog({
	open,
	onOpenChange,
}: CreateAdminDialogProps) {
	const createAdmin = useCreateAdmin();

	const form = useForm({
		defaultValues: { email: "", password: "" },
		onSubmit: async ({ value }) => {
			const result = createAdminSchema.safeParse(value);
			if (!result.success) return;
			await createAdmin.mutateAsync(result.data, {
				onSuccess: () => {
					form.reset();
					onOpenChange(false);
				},
			});
		},
		validators: {
			onSubmit: createAdminSchema,
		},
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-130">
				<DialogHeader>
					<DialogTitle>Create Admin</DialogTitle>
					<DialogDescription>
						Add a new admin by providing email and a strong password.
					</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={(event) => {
						event.preventDefault();
						form.handleSubmit();
					}}
					className="space-y-4"
				>
					<form.Field name="email">
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Email</Label>
								<Input
									id={field.name}
									type="email"
									placeholder="admin@upstride.com"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(event) => field.handleChange(event.target.value)}
								/>
								<FieldError message={field.state.meta.errors?.[0]?.message} />
							</div>
						)}
					</form.Field>
					<form.Field name="password">
						{(field) => (
							<div className="space-y-2">
								<Label htmlFor={field.name}>Password</Label>
								<Input
									id={field.name}
									type="password"
									placeholder="Strong password"
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(event) => field.handleChange(event.target.value)}
								/>
								<FieldError message={field.state.meta.errors?.[0]?.message} />
							</div>
						)}
					</form.Field>

					<DialogFooter className="gap-2 sm:gap-0">
						<Button
							variant="ghost"
							type="button"
							onClick={() => onOpenChange(false)}
							disabled={createAdmin.isPending}
						>
							Cancel
						</Button>
						<form.Subscribe selector={(s) => s.isSubmitting}>
							{(isSubmitting) => (
								<Button
									type="submit"
									disabled={isSubmitting || createAdmin.isPending}
								>
									{(isSubmitting || createAdmin.isPending) && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									Create Admin
								</Button>
							)}
						</form.Subscribe>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

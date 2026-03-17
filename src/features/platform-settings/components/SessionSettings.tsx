import { useForm } from "@tanstack/react-form";
import { CalendarClock, Save, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import FieldError from "@/components/common/Field-Error";
import {
	buildEmptyStringErrors,
	buildFieldErrorsFromIssues,
} from "@/shared/utils/form-validation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SessionSettingsConfig } from "../types";
import { sessionSettingsSchema } from "../validators/platform-settings.schema";

type SessionSettingsFormValues = Omit<
	SessionSettingsConfig,
	| "cancellationWindowHours"
	| "rescheduleWindowHours"
	| "maxSessionsPerDayPerMentor"
> & {
	cancellationWindowHours: number | "";
	rescheduleWindowHours: number | "";
	maxSessionsPerDayPerMentor: number | "";
};

interface SessionSettingsProps {
	settings: SessionSettingsConfig;
	onUpdate: (data: SessionSettingsConfig) => Promise<void>;
	isLoading: boolean;
}

export function SessionSettings({
	settings,
	onUpdate,
	isLoading,
}: SessionSettingsProps) {
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [pendingData, setPendingData] = useState<SessionSettingsConfig | null>(
		null,
	);

	const validateForm = (value: SessionSettingsFormValues) => {
		const emptyErrors = buildEmptyStringErrors(value);
		if (Object.keys(emptyErrors).length > 0) {
			return { fields: emptyErrors };
		}

		const parsed = sessionSettingsSchema.safeParse(value);
		return parsed.success
			? undefined
			: {
					fields: buildFieldErrorsFromIssues(parsed.error.issues),
				};
	};

	const form = useForm({
		defaultValues: settings as SessionSettingsFormValues,
		validators: {
			onChange: ({ value }) => validateForm(value),
		},
		onSubmit: async ({ value }) => {
			const parsed = sessionSettingsSchema.safeParse(value);
			if (!parsed.success) return;
			setPendingData(parsed.data);
			setIsConfirmOpen(true);
		},
	});

	const handleConfirmUpdate = async () => {
		if (pendingData) {
			await onUpdate(pendingData);
			setIsConfirmOpen(false);
			setPendingData(null);
		}
	};

	const parseNumberInput = (value: string): number | "" =>
		value === "" ? "" : Number(value);
	const getErrorMessage = (errors: unknown) => {
		if (!errors) return undefined;
		if (Array.isArray(errors)) {
			const first = errors[0] as { message?: string } | undefined;
			return first?.message || first?.toString() || undefined;
		}
		if (typeof errors === "string") return errors;
		if (typeof errors === "object") {
			const message = (errors as { message?: string }).message;
			return message || String(errors);
		}
		return String(errors);
	};

	return (
		<div className="space-y-6">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="space-y-6"
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<Card className="border-border/60 shadow-sm">
						<CardHeader className="bg-muted/20">
							<CardTitle className="flex items-center gap-2 text-lg">
								<CalendarClock className="w-5 h-5 text-primary" />
								Windows
							</CardTitle>
							<CardDescription>
								Time limits for session actions.
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-6 space-y-4">
							<form.Field name="cancellationWindowHours">
								{(field) => (
									<div className="space-y-2">
										<Label className="text-sm">Cancellation Window (Hrs)</Label>
										<Input
											type="number"
											value={field.state.value ?? ""}
											onChange={(e) =>
												field.handleChange(parseNumberInput(e.target.value))
											}
											onBlur={field.handleBlur}
										/>
										<FieldError
											message={getErrorMessage(field.state.meta.errors)}
										/>
									</div>
								)}
							</form.Field>
							<form.Field name="rescheduleWindowHours">
								{(field) => (
									<div className="space-y-2">
										<Label className="text-sm">Reschedule Window (Hrs)</Label>
										<Input
											type="number"
											value={field.state.value ?? ""}
											onChange={(e) =>
												field.handleChange(parseNumberInput(e.target.value))
											}
											onBlur={field.handleBlur}
										/>
										<FieldError
											message={getErrorMessage(field.state.meta.errors)}
										/>
									</div>
								)}
							</form.Field>
						</CardContent>
					</Card>

					<Card className="border-border/60 shadow-sm">
						<CardHeader className="bg-muted/20">
							<CardTitle className="flex items-center gap-2 text-lg">
								<ShieldCheck className="w-5 h-5 text-primary" />
								Availability
							</CardTitle>
							<CardDescription>Rules for session distribution.</CardDescription>
						</CardHeader>
						<CardContent className="pt-6 space-y-4">
							<form.Field name="maxSessionsPerDayPerMentor">
								{(field) => (
									<div className="space-y-2">
										<Label className="text-sm">
											Max Sessions/Day per Mentor
										</Label>
										<Input
											type="number"
											value={field.state.value ?? ""}
											onChange={(e) =>
												field.handleChange(parseNumberInput(e.target.value))
											}
											onBlur={field.handleBlur}
										/>
										<FieldError
											message={getErrorMessage(field.state.meta.errors)}
										/>
									</div>
								)}
							</form.Field>
						</CardContent>
					</Card>
				</div>

				<div className="flex justify-end pt-4">
					<Button
						type="submit"
						size="lg"
						disabled={isLoading}
						className="px-8 shadow-md"
					>
						<Save className="w-4 h-4 mr-2" />
						Update Session Rules
					</Button>
				</div>
			</form>

			<ConfirmModal
				isOpen={isConfirmOpen}
				onClose={() => setIsConfirmOpen(false)}
				onConfirm={handleConfirmUpdate}
				title="Confirm Session Settings Change"
				message="Adjusting session windows and limits will affect all upcoming bookings. Are you sure you wish to proceed?"
				variant="destructive"
				isLoading={isLoading}
				confirmText="Yes, Update Session Rules"
			/>
		</div>
	);
}
